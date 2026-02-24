import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadToDrive } from "@/lib/google-drive";
import { sendDriverApplicationNotification } from "@/lib/email";
import { driverLimiter, getIP } from "@/lib/rate-limit";

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  fullName: z.string().trim().min(2),
  address: z.string().trim().min(5),
  phone: z.string().trim().min(5),
  email: z.string().trim().email(),
  licenceType: z.string().trim().min(1),
  experienceYears: z.coerce.number().int().min(0),
  rightToWork: z.enum(["yes", "no"]),
  cpcStatus: z.string().trim().optional(),
  hgvCategory: z.string().trim().optional(),
  availability: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getIP(req);
    const { success } = await driverLimiter.limit(`driver:${ipAddress}`);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submissions. Please try again later.",
        },
        { status: 429 },
      );
    }

    const formData = await req.formData();

    const cvFile = formData.get("cvFile");
    if (!(cvFile instanceof File) || cvFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "CV file is required." },
        { status: 400 },
      );
    }
    if (cvFile.size > MAX_CV_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }
    if (!ALLOWED_CV_MIME_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Use PDF, DOC, or DOCX." },
        { status: 400 },
      );
    }

    const data = schema.parse({
      fullName: formData.get("fullName"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      licenceType: formData.get("licenceType"),
      experienceYears: formData.get("experienceYears"),
      rightToWork: formData.get("rightToWork"),
      cpcStatus: formData.get("cpcStatus") || undefined,
      hgvCategory: formData.get("hgvCategory") || undefined,
      availability: formData.get("availability") || undefined,
    });

    const fileId = await uploadToDrive(cvFile);
    const cvFileUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const rightToWork = data.rightToWork === "yes";

    await prisma.driverApplication.create({
      data: {
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        licenceType: data.licenceType,
        experienceYears: data.experienceYears,
        rightToWork,
        cpcStatus: data.cpcStatus,
        hgvCategory: data.hgvCategory,
        availability: data.availability,
        cvFileUrl,
        ipAddress,
      },
    });

    try {
      await sendDriverApplicationNotification({
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        licenceType: data.licenceType,
        experienceYears: data.experienceYears,
        rightToWork,
        cpcStatus: data.cpcStatus,
        hgvCategory: data.hgvCategory,
        availability: data.availability,
        cvFileUrl,
      });
    } catch (error) {
      console.error("Driver application email failed:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Driver application submission failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload" },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
