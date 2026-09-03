"use client";

import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  FileText,
  Info,
  Upload,
  X,
} from "lucide-react";
import Layout from "@/components/Layout";
import HeroEyebrow from "@/components/HeroEyebrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const revealEase: [number, number, number, number] = [0.25, 0.8, 0.25, 1];
const revealViewport = { once: true, amount: 0.2 } as const;

const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: revealEase,
      delay,
    },
  }),
};

const formFieldClassName =
  "mt-1.5 h-11 rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] focus-visible:border-[#F5C518]";

const selectTriggerClassName =
  "mt-1.5 h-11 rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:ring-2 focus:ring-[#F5C518] focus:ring-offset-0";

const labelClassName = "text-sm font-medium text-slate-700";

type AvailabilityMode = "immediate" | "within_2_weeks" | "select_date";

const phoneCountries = [
  { code: "GB", label: "UK", dialCode: "+44" },
  { code: "IE", label: "IE", dialCode: "+353" },
  { code: "NL", label: "NL", dialCode: "+31" },
];

const validCvTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function formatPhoneLocal(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)} ${digits.slice(10)}`;
}

function toE164(dialCode: string, localNumber: string) {
  const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  return `${dialCode}${digits}`;
}

function isValidE164(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

const processSteps = [
  {
    number: 1,
    title: "Submit Your Application",
    description: "Complete the form below with your details and experience.",
  },
  {
    number: 2,
    title: "Initial Assessment",
    description: "Our team will review your application and be in touch if your profile matches our current requirements.",
  },
  {
    number: 3,
    title: "Onboarding",
    description: "Successful applicants will be guided through our onboarding process.",
  },
];

const FieldHint = ({ title, description }: { title: string; description: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-4 w-4 items-center justify-center text-slate-500 transition hover:text-slate-900"
          aria-label={`${title} information`}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs rounded-md border border-slate-200 bg-white p-4 text-sm shadow-lg">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-2 leading-relaxed text-slate-700">{description}</p>
      </PopoverContent>
    </Popover>
  );
};

const WarehouseOperativeApplication = () => {
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rightToWork, setRightToWork] = useState("");
  const [availabilityMode, setAvailabilityMode] = useState<AvailabilityMode>("immediate");
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(undefined);
  const [availabilityCalendarOpen, setAvailabilityCalendarOpen] = useState(false);
  const [availabilityMonth, setAvailabilityMonth] = useState<Date>(new Date());

  const [phoneCountry, setPhoneCountry] = useState("GB");
  const [phoneLocal, setPhoneLocal] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = useMemo(
    () => phoneCountries.find((country) => country.code === phoneCountry) ?? phoneCountries[0],
    [phoneCountry],
  );

  const e164Phone = useMemo(
    () => toE164(selectedCountry.dialCode, phoneLocal),
    [selectedCountry.dialCode, phoneLocal],
  );

  const availabilityValue = useMemo(() => {
    if (availabilityMode === "immediate") return "Immediate";
    if (availabilityMode === "within_2_weeks") return "Within 2 Weeks";
    if (!availabilityDate) return "";
    return `Available from ${format(availabilityDate, "PPP")}`;
  }, [availabilityMode, availabilityDate]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneLocal(formatPhoneLocal(e.target.value));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!validCvTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file only.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!file) {
      toast({
        title: "CV Required",
        description: "Please upload your CV.",
        variant: "destructive",
      });
      return;
    }

    if (!rightToWork) {
      toast({
        title: "Right to Work Required",
        description: "Please confirm your right to work status.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidE164(e164Phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Use a valid international number format.",
        variant: "destructive",
      });
      return;
    }

    if (availabilityMode === "select_date" && !availabilityDate) {
      toast({
        title: "Availability Date Required",
        description: "Please choose your available start date.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(form);
      const response = await fetch("/api/warehouse-operative-application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message || "Request failed");
      }

      toast({
        title: "Application Submitted",
        description: "Thank you. We will review your application and be in touch.",
      });

      form.reset();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setRightToWork("");
      setAvailabilityMode("immediate");
      setAvailabilityDate(undefined);
      setPhoneCountry("GB");
      setPhoneLocal("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section
        className="relative flex min-h-[520px] items-center overflow-hidden md:min-h-[560px] lg:min-h-[580px]"
        style={{
          backgroundImage: "url('/assets/warehouse-real-1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/30" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 md:px-12 lg:px-16">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <HeroEyebrow text="Warehouse Operatives" />
            <h1 className="max-w-[720px] font-display text-[clamp(3.5rem,5.5vw,4.5rem)] font-bold leading-[0.94] tracking-[-0.03em] text-white">
              Apply as a
              <br />
              <span className="font-display italic text-[#F5C518]">
                Warehouse Operative
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 lg:text-lg">
              Join our warehouse and distribution team supporting UK logistics operations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] py-14 md:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            className="mb-12 text-center"
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F5C518]">
              The Process
            </p>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">How to Apply</h2>
          </motion.div>

          <div className="relative flex flex-col items-start justify-center gap-0 sm:flex-row">
            <div className="absolute left-1/2 top-[28px] z-0 hidden w-[calc(100%-160px)] max-w-[520px] -translate-x-1/2 border-t-2 border-dashed border-slate-300 sm:block" />

            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative z-10 mb-8 flex w-full flex-col items-center px-4 text-center sm:mb-0 sm:w-1/3"
                variants={revealVariant}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                custom={index * 0.15}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] shadow-sm">
                  <span className="text-xl font-bold text-slate-900">{step.number}</span>
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="max-w-[200px] text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="warehouse-operative-application-form" className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[760px] px-6">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Warehouse Operative Application Form
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Please complete all sections accurately. All fields marked{" "}
              <span className="text-red-500">*</span> are required.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            noValidate
          >
            <fieldset className="mb-8">
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                  Personal Information
                </h3>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="fullName" className={labelClassName}>
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="e.g. James Thompson"
                    className={formFieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className={labelClassName}>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="james@example.com"
                    className={formFieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="phoneLocal" className={labelClassName}>
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-[130px_1fr]">
                    <Select value={phoneCountry} onValueChange={setPhoneCountry}>
                      <SelectTrigger className={cn(selectTriggerClassName, "mt-0")}>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {phoneCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.label} ({country.dialCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      id="phoneLocal"
                      type="tel"
                      value={phoneLocal}
                      onChange={handlePhoneChange}
                      required
                      placeholder="7700 900000"
                      className={cn(formFieldClassName, "mt-0")}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="warehouseExperienceYears" className={labelClassName}>
                      Years of Warehouse Experience <span className="text-red-500">*</span>
                    </Label>
                    <FieldHint
                      title="Warehouse Experience"
                      description="Enter total years of professional warehouse or distribution centre experience."
                    />
                  </div>
                  <Input
                    id="warehouseExperienceYears"
                    name="warehouseExperienceYears"
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 3"
                    className={formFieldClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className={labelClassName}>
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="123 High Street, London, E1 6AN"
                    className={formFieldClassName}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                    Eligibility
                  </h3>
                  <FieldHint
                    title="Right to Work"
                    description="Applicants must have legal permission to work in the United Kingdom."
                  />
                </div>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div>
                <Label htmlFor="rightToWork" className={labelClassName}>
                  Right to Work in the UK? <span className="text-red-500">*</span>
                </Label>
                <Select value={rightToWork} onValueChange={setRightToWork}>
                  <SelectTrigger id="rightToWork" className={selectTriggerClassName}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            <fieldset className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                    Availability
                  </h3>
                  <FieldHint
                    title="Availability"
                    description="Select your expected start timeline. Choose a specific date for a planned start."
                  />
                </div>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    ["immediate", "Immediately"],
                    ["within_2_weeks", "Within 2 weeks"],
                    ["select_date", "Specific date"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAvailabilityMode(value)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-[4px] border px-4 py-2.5 text-sm transition",
                      availabilityMode === value
                        ? "border-[#F5C518] bg-[#F5C518]/10 text-slate-900"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border-2",
                        availabilityMode === value ? "border-[#F5C518]" : "border-slate-400",
                      )}
                    >
                      {availabilityMode === value && (
                        <span className="h-2 w-2 rounded-full bg-[#F5C518]" />
                      )}
                    </span>
                    {label}
                  </button>
                ))}
              </div>

              {availabilityMode === "select_date" && (
                <div className="mt-3 max-w-sm">
                  <Popover
                    open={availabilityCalendarOpen}
                    onOpenChange={(open) => {
                      setAvailabilityCalendarOpen(open);
                      if (open) {
                        setAvailabilityMonth(
                          (currentMonth) => availabilityDate ?? currentMonth,
                        );
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-between rounded-[4px] border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
                      >
                        <span>
                          {availabilityDate
                            ? format(availabilityDate, "PPP")
                            : "Select start date"}
                        </span>
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[288px] p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={availabilityDate}
                        onSelect={(date) => {
                          setAvailabilityDate(date);
                          if (date) setAvailabilityMonth(date);
                        }}
                        month={availabilityMonth}
                        onMonthChange={setAvailabilityMonth}
                        showOutsideDays={false}
                        fixedWeeks
                        className="w-[288px]"
                        classNames={{
                          cell: "h-9 w-9 p-0 text-center text-sm",
                          day: "h-9 w-9 rounded-[4px] p-0 text-sm font-normal text-slate-900 hover:bg-[#F5C518]/20",
                          day_today: "bg-[#F5C518]/20 text-slate-900",
                          day_selected:
                            "bg-[#F5C518] text-slate-900 hover:bg-[#F5C518]/90 hover:text-slate-900 focus:bg-[#F5C518]/90 focus:text-slate-900",
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </fieldset>

            <fieldset className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                    CV Upload
                  </h3>
                  <FieldHint
                    title="CV Upload"
                    description="Upload your latest CV in PDF, DOC, or DOCX format (max 5MB)."
                  />
                </div>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center gap-3 rounded-[4px] border border-slate-300 bg-white p-3">
                  <FileText className="h-8 w-8 shrink-0 text-slate-900" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Remove uploaded CV"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-[4px] border-2 border-dashed border-slate-300 p-8 text-center transition hover:bg-slate-50"
                >
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-900">Click to upload your CV</p>
                  <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX — Max 5MB</p>
                </button>
              )}
            </fieldset>

            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  id="gdprConsent"
                  name="gdprConsent"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5C518]"
                />
                <span>
                  I consent to GIPA Services Limited storing and processing my data in accordance
                  with UK GDPR.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#F5C518] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-900 transition hover:bg-[#F5C518]/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Application
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>

            <input type="hidden" name="phone" value={e164Phone} />
            <input type="hidden" name="rightToWork" value={rightToWork} />
            <input type="hidden" name="availability" value={availabilityValue} />
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default WarehouseOperativeApplication;
