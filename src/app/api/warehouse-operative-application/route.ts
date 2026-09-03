import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ENV } from "@/lib/env";
import {
  sendWarehouseOperativeApplicationConfirmation,
  sendWarehouseOperativeApplicationNotification,
} from "@/lib/email";
import { getIP } from "@/lib/rate-limit";
import { uploadToWorkDrive } from "@/lib/zoho-workdrive";

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
  warehouseExperienceYears: z.coerce.number().int().min(0),
  rightToWork: z.enum(["yes", "no"]),
  gdprConsent: z.literal("on"),
  availability: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getIP(req);

    const formData = await req.formData();
    const gdprConsent = formData.get("gdprConsent");
    if (gdprConsent !== "on") {
      return NextResponse.json(
        { success: false, message: "Consent is required." },
        { status: 400 },
      );
    }

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
      warehouseExperienceYears: formData.get("warehouseExperienceYears"),
      rightToWork: formData.get("rightToWork"),
      gdprConsent,
      availability: formData.get("availability") || undefined,
    });

    const { fileUrl: cvFileUrl } = await uploadToWorkDrive(
      cvFile,
      ENV.ZOHO_WORKDRIVE_WAREHOUSE_FOLDER_ID,
    );
    const rightToWork = data.rightToWork === "yes";

    await prisma.warehouseOperativeApplication.create({
      data: {
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        warehouseExperienceYears: data.warehouseExperienceYears,
        rightToWork,
        gdprConsent: true,
        consentTimestamp: new Date(),
        availability: data.availability,
        cvFileUrl,
        ipAddress,
      },
    });

    try {
      await sendWarehouseOperativeApplicationNotification({
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        warehouseExperienceYears: data.warehouseExperienceYears,
        rightToWork,
        availability: data.availability,
        cvFileUrl,
      });
    } catch (error) {
      console.error("Warehouse operative application email failed:", error);
    }

    try {
      await sendWarehouseOperativeApplicationConfirmation({
        fullName: data.fullName,
        email: data.email,
      });
    } catch (error) {
      console.error(
        "Warehouse operative application confirmation email failed:",
        error,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Warehouse operative application submission failed:", error);

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
