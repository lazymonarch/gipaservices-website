"use client";

import { useState, FormEvent, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DriverApplication = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rightToWork, setRightToWork] = useState("");
  const [licenceType, setLicenceType] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(f.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PDF or DOC file only.", variant: "destructive" });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "CV Required", description: "Please upload your CV.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Application Submitted", description: "Thank you. We will review your application and be in touch." });
      (e.target as HTMLFormElement).reset();
      setFile(null);
      setRightToWork("");
      setLicenceType("");
    }, 1200);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-accent">
        <div className="container-narrow px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-accent-foreground mb-3">Driver Application</h1>
          <p className="text-accent-foreground/80 text-lg">Join our team of professional HGV drivers.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required fields */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
              <div>
                <Label htmlFor="driverName">Full Name *</Label>
                <Input id="driverName" name="driverName" required className="mt-1.5" placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="driverAddress">Full Address *</Label>
                <Input id="driverAddress" name="driverAddress" required className="mt-1.5" placeholder="Your full address" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="driverPhone">Phone Number *</Label>
                  <Input id="driverPhone" name="driverPhone" type="tel" required className="mt-1.5" placeholder="+44" />
                </div>
                <div>
                  <Label htmlFor="driverEmail">Email Address *</Label>
                  <Input id="driverEmail" name="driverEmail" type="email" required className="mt-1.5" placeholder="you@email.com" />
                </div>
              </div>
            </div>

            {/* Driving details */}
            <div className="space-y-5 pt-4 border-t">
              <h2 className="text-lg font-semibold text-foreground">Driving Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Driving Licence Type *</Label>
                  <Select value={licenceType} onValueChange={setLicenceType} required>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">Category C</SelectItem>
                      <SelectItem value="C+E">Category C+E</SelectItem>
                      <SelectItem value="C1">Category C1</SelectItem>
                      <SelectItem value="C1+E">Category C1+E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Years of Driving Experience *</Label>
                  <Input id="experience" name="experience" type="number" min="0" required className="mt-1.5" placeholder="e.g. 5" />
                </div>
              </div>
              <div>
                <Label>Right to Work in UK *</Label>
                <Select value={rightToWork} onValueChange={setRightToWork} required>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Optional fields */}
            <div className="space-y-5 pt-4 border-t">
              <h2 className="text-lg font-semibold text-foreground">Additional Information <span className="text-muted-foreground font-normal text-sm">(Optional)</span></h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="cpcStatus">Driver CPC Status</Label>
                  <Input id="cpcStatus" name="cpcStatus" className="mt-1.5" placeholder="e.g. Valid until 2027" />
                </div>
                <div>
                  <Label htmlFor="hgvCategory">HGV Licence Category</Label>
                  <Input id="hgvCategory" name="hgvCategory" className="mt-1.5" placeholder="e.g. Class 1" />
                </div>
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" name="availability" className="mt-1.5" placeholder="e.g. Immediate / 2 weeks notice" />
              </div>
            </div>

            {/* CV Upload */}
            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-lg font-semibold text-foreground">Upload CV *</h2>
              <p className="text-xs text-muted-foreground">PDF or DOC only. Maximum 5MB.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <FileText className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Click to upload your CV</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF or DOC, max 5MB</p>
                </button>
              )}
            </div>

            <div className="pt-4">
              <p className="text-xs text-muted-foreground mb-4">
                All applications are handled securely and in compliance with UK data protection standards.
              </p>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default DriverApplication;
