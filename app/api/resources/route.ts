import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Resource } from '@/types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const longDescription = formData.get('longDescription') as string;
    const category = formData.get('category') as string;
    const version = formData.get('version') as string;
    const tagsString = formData.get('tags') as string;
    const resourceFile = formData.get('resourceFile') as File;
    const thumbnail = formData.get('thumbnail') as File | null;

    // Validation
    if (!title || !description || !category || !resourceFile) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Create upload directories
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const resourcesDir = path.join(uploadsDir, 'resources');
    const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
    const imagesDir = path.join(uploadsDir, 'images');

    for (const dir of [uploadsDir, resourcesDir, thumbnailsDir, imagesDir]) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }

    // Generate unique identifiers
    const slug = generateSlug(title);
    const timestamp = Date.now();

    // Save resource file
    const resourceExt = resourceFile.name.split('.').pop();
    const resourceFileName = `${slug}.${resourceExt}`;
    const resourcePath = path.join(resourcesDir, resourceFileName);
    const resourceBuffer = Buffer.from(await resourceFile.arrayBuffer());
    await writeFile(resourcePath, resourceBuffer);

    // Save thumbnail if provided
    let thumbnailPath = null;
    if (thumbnail) {
      const thumbExt = thumbnail.name.split('.').pop();
      const thumbFileName = `${slug}-thumb.${thumbExt}`;
      thumbnailPath = `/uploads/thumbnails/${thumbFileName}`;
      const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
      await writeFile(path.join(thumbnailsDir, thumbFileName), thumbBuffer);
    }

    // Save additional images
    const images: string[] = [];
    for (let i = 0; i < 5; i++) {
      const image = formData.get(`image_${i}`) as File | null;
      if (image) {
        const imgExt = image.name.split('.').pop();
        const imgFileName = `${slug}-${i}.${imgExt}`;
        const imgPath = `/uploads/images/${imgFileName}`;
        const imgBuffer = Buffer.from(await image.arrayBuffer());
        await writeFile(path.join(imagesDir, imgFileName), imgBuffer);
        images.push(imgPath);
      }
    }

    // Parse tags
    const tags = tagsString
      ? tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    // Insert into database
    await query(
      `INSERT INTO resources (
        id, title, slug, description, long_description, category,
        version, author_id, file_path, file_size, thumbnail, images, tags
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        description,
        longDescription || '',
        category,
        version || '1.0.0',
        user.id,
        `/uploads/resources/${resourceFileName}`,
        resourceFile.size,
        thumbnailPath,
        JSON.stringify(images),
        JSON.stringify(tags),
      ]
    );

    // Get the created resource
    const resources = await query<Resource[]>(
      `SELECT * FROM resources WHERE slug = ?`,
      [slug]
    );

    return NextResponse.json({
      success: true,
      slug,
      resource: resources[0],
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE is_approved = TRUE';
  const params: unknown[] = [];

  if (category) {
    whereClause += ' AND category IN (?)';
    params.push(category.split(','));
  }

  if (search) {
    whereClause += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  let orderClause = '';
  switch (sortBy) {
    case 'popular':
      orderClause = 'ORDER BY view_count DESC';
      break;
    case 'top_rated':
      orderClause = 'ORDER BY average_rating DESC';
      break;
    case 'most_downloaded':
      orderClause = 'ORDER BY download_count DESC';
      break;
    default:
      orderClause = 'ORDER BY created_at DESC';
  }

  try {
    // Get total count
    const countResult = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM resources ${whereClause}`,
      params
    );
    const total = countResult[0].count;

    // Get resources with author info
    const resources = await query<Resource[]>(
      `SELECT r.*, 
        u.id as author_id, u.username as author_username, u.avatar as author_avatar, u.role as author_role
       FROM resources r
       LEFT JOIN users u ON r.author_id = u.id
       ${whereClause}
       ${orderClause}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des ressources' },
      { status: 500 }
    );
  }
}
