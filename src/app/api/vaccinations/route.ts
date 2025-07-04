import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseISO } from 'date-fns';

export async function GET() {
  try {
    const vaccinations = await prisma.vaccination.findMany({
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json(vaccinations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vaccinations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, dueDate } = await req.json();
    if (!name || !dueDate) {
      return NextResponse.json({ error: 'Name and dueDate are required' }, { status: 400 });
    }
    const vaccination = await prisma.vaccination.create({
      data: {
        name,
        dueDate: parseISO(dueDate),
      },
    });
    return NextResponse.json(vaccination, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vaccination' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, lastCompleted, dueDate } = await req.json();
    if (!id || !lastCompleted || !dueDate) {
      return NextResponse.json({ error: 'id, lastCompleted, and dueDate are required' }, { status: 400 });
    }
    const vaccination = await prisma.vaccination.update({
      where: { id },
      data: {
        lastCompleted: parseISO(lastCompleted),
        dueDate: parseISO(dueDate),
      },
    });
    return NextResponse.json(vaccination);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vaccination' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    await prisma.vaccination.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vaccination' }, { status: 500 });
  }
} 