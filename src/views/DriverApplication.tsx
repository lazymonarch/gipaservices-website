"use client";

import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClipboardList,
  FileText,
  Info,
  Truck,
  Upload,
  UserCheck,
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
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Initial Assessment",
    description: "Our team will review your application and contact you within 48 hours.",
    icon: UserCheck,
  },
  {
    number: 3,
    title: "Onboarding",
    description: "Successful applicants will be guided through our onboarding process.",
    icon: Truck,
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

const DriverApplication = () => {
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [licenceType, setLicenceType] = useState("");
  const [hgvCategory, setHgvCategory] = useState("");
  const [cpcStatus, setCpcStatus] = useState("");
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

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file only.",
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

    if (!licenceType) {
      toast({
        title: "Licence Type Required",
        description: "Please select your driving licence type.",
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
      const response = await fetch("/api/driver-application", {
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
      setLicenceType("");
      setHgvCategory("");
      setCpcStatus("");
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
      {/* Hero Section */}
      <section
        className="relative flex min-h-[520px] items-center overflow-hidden md:min-h-[560px] lg:min-h-[580px]"
        style={{
          backgroundImage: "url('/assets/hero-truck.jpg')",
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
            <HeroEyebrow text="Driver Application" />
            <h1 className="max-w-[720px] font-display text-[clamp(3.5rem,5.5vw,4.5rem)] font-bold leading-[0.94] tracking-[-0.03em] text-white">
              Drive With
              <br />
              <span className="font-display italic text-[#F5C518]">
                GIPA Services
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 lg:text-lg">
              Join our team of professional HGV drivers operating across the UK.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How to Apply / Process Steps Section */}
      <section className="bg-[#F5F3F0] py-14 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <p className="text-xs font-semibold tracking-widest text-[#F5C518] uppercase mb-2">The Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How to Apply</h2>
          </motion.div>

          {/* Steps with connecting dashed line */}
          <div className="relative flex flex-col sm:flex-row items-start justify-center gap-0">
            {/* Dashed connector line (desktop only) */}
            <div className="hidden sm:block absolute top-[28px] left-1/2 -translate-x-1/2 w-[calc(100%-160px)] max-w-[520px] border-t-2 border-dashed border-slate-300 z-0" />

            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative z-10 flex flex-col items-center text-center w-full sm:w-1/3 px-4 mb-8 sm:mb-0"
                variants={revealVariant}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                custom={index * 0.15}
              >
                <div className="w-14 h-14 rounded-full bg-[#F5C518] flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-xl font-bold text-slate-900">{step.number}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Application Form Section */}
      <section id="driver-application-form" className="bg-white py-12 md:py-16">
        <div className="max-w-[760px] mx-auto px-6">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Driver Application Form</h2>
            <p className="mt-2 text-sm text-slate-600">
              Please complete all sections accurately. All fields marked <span className="text-red-500">*</span> are required.
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
            {/* Personal Information */}
            <fieldset className="mb-8">
              <div className="mb-5">
                <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Personal Information</h3>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <Label htmlFor="fullName" className={labelClassName}>Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="e.g. James Thompson"
                    className={formFieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className={labelClassName}>Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className={formFieldClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="phoneLocal" className={labelClassName}>Phone Number <span className="text-red-500">*</span></Label>
                  <div className="mt-1.5 grid grid-cols-[110px_1fr] gap-2">
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
                      placeholder="+44 ..."
                      className={cn(formFieldClassName, "mt-0")}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="experienceYears" className={labelClassName}>Years of Driving Experience <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Driving Experience"
                      description="Enter total years of professional HGV driving experience."
                    />
                  </div>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 5"
                    className={formFieldClassName}
                  />
                </div>
              </div>
            </fieldset>

            {/* Driving Qualifications */}
            <fieldset className="mb-8">
              <div className="mb-5">
                <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Driving Qualifications</h3>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="licenceType" className={labelClassName}>Driving Licence Type <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Driving Licence Type"
                      description="Select your current DVLA licence category from your valid UK licence."
                    />
                  </div>
                  <Select value={licenceType} onValueChange={setLicenceType}>
                    <SelectTrigger id="licenceType" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Category B">Category B</SelectItem>
                      <SelectItem value="Category C1">Category C1</SelectItem>
                      <SelectItem value="Category C1+E">Category C1+E</SelectItem>
                      <SelectItem value="Category C">Category C</SelectItem>
                      <SelectItem value="Category C+E">Category C+E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="hgvCategory" className={labelClassName}>HGV Licence Category</Label>
                    <FieldHint
                      title="HGV Licence Category"
                      description="Choose the HGV class you are qualified to operate."
                    />
                  </div>
                  <Select value={hgvCategory} onValueChange={setHgvCategory}>
                    <SelectTrigger id="hgvCategory" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class 2 (Category C)">Class 2 (Category C)</SelectItem>
                      <SelectItem value="Class 1 (Category C+E)">Class 1 (Category C+E)</SelectItem>
                      <SelectItem value="Both Class 1 & 2">Both Class 1 & 2</SelectItem>
                      <SelectItem value="Currently Training">Currently Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="cpcStatus" className={labelClassName}>Driver CPC Status</Label>
                    <FieldHint
                      title="Driver CPC Status"
                      description="A valid CPC is required for professional HGV driving in the UK."
                    />
                  </div>
                  <Select value={cpcStatus} onValueChange={setCpcStatus}>
                    <SelectTrigger id="cpcStatus" className={selectTriggerClassName}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Valid - Expires within 1 year">Valid - Expires within 1 year</SelectItem>
                      <SelectItem value="Valid - Expires within 2 years">Valid - Expires within 2 years</SelectItem>
                      <SelectItem value="Valid - Expires 3+ years">Valid - Expires 3+ years</SelectItem>
                      <SelectItem value="Expired - Renewal Required">Expired - Renewal Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="rightToWork" className={labelClassName}>Right to Work in UK <span className="text-red-500">*</span></Label>
                    <FieldHint
                      title="Right to Work"
                      description="Applicants must have legal permission to work in the United Kingdom."
                    />
                  </div>
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

                <div className="md:col-span-2">
                  <Label htmlFor="address" className={labelClassName}>Full Address <span className="text-red-500">*</span></Label>
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

            {/* Availability */}
            <fieldset className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">Availability</h3>
                  <FieldHint
                    title="Availability"
                    description="Select your expected start timeline. Choose date for planned start."
                  />
                </div>
                <div className="mt-2 h-[2px] bg-[#F5C518]" />
              </div>

              <div className="flex flex-wrap gap-3">
                {(
                  [
                    ["immediate", "Immediate"],
                    ["within_2_weeks", "Within 2 Weeks"],
                    ["select_date", "Select Date"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAvailabilityMode(value)}
                    className={cn(
                      "inline-flex items-center gap-2 border rounded-[4px] px-4 py-2.5 text-sm transition",
                      availabilityMode === value
                        ? "border-[#F5C518] text-slate-900 bg-[#F5C518]/10"
                        : "border-slate-300 text-slate-600 bg-white hover:border-slate-400",
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                        availabilityMode === value ? "border-[#F5C518]" : "border-slate-400",
                      )}
                    >
                      {availabilityMode === value && <span className="h-2 w-2 rounded-full bg-[#F5C518]" />}
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
                        setAvailabilityMonth((currentMonth) => availabilityDate ?? currentMonth);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-between rounded-[4px] border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
                      >
                        <span>{availabilityDate ? format(availabilityDate, "PPP") : "Select start date"}</span>
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
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </fieldset>

            {/* CV Upload */}
            <fieldset className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase">CV Upload</h3>
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
                  <FileText className="h-8 w-8 text-slate-900 shrink-0" />
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

            {/* Consent & Submit */}
            <div className="mt-6 space-y-3">
              <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  id="gdprConsent"
                  name="gdprConsent"
                  required
                  className="mt-0.5 h-4 w-4 accent-[#F5C518] shrink-0"
                />
                <span>
                  I confirm that all information provided is accurate and complete.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  required
                  className="mt-0.5 h-4 w-4 accent-[#F5C518] shrink-0"
                />
                <span>
                  I consent to GIPA Services processing my personal data for recruitment purposes in accordance with the{" "}
                  <a href="/privacy-policy" className="underline text-slate-900 hover:text-[#F5C518] transition-colors">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#F5C518] text-slate-900 px-8 py-3.5 text-sm font-bold uppercase tracking-widest rounded-[4px] transition hover:bg-[#F5C518]/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : (
                <>
                  Submit Application
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            <input type="hidden" name="phone" value={e164Phone} />
            <input type="hidden" name="licenceType" value={licenceType} />
            <input type="hidden" name="hgvCategory" value={hgvCategory} />
            <input type="hidden" name="cpcStatus" value={cpcStatus} />
            <input type="hidden" name="rightToWork" value={rightToWork} />
            <input type="hidden" name="availability" value={availabilityValue} />
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default DriverApplication;
