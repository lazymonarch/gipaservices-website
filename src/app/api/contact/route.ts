import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { contactLimiter, getIP } from "@/lib/rate-limit";

const schema = z.object({
  fullName: z.string().trim().min(2),
  companyName: z.string().trim().optional(),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getIP(req);
    const { success } = await contactLimiter.limit(`contact:${ipAddress}`);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const data = schema.parse(body);

    await prisma.contact.create({
      data: {
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        ipAddress,
      },
    });

    try {
      await sendContactNotification({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });
    } catch (error) {
      console.error("Contact notification email failed:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
