import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - জলধারা",
  description: "Terms of Service for জলধারা Water Delivery App",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex-1 flex justify-center">
              <Logo size="md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-600 mb-2">
              Terms of Service
            </CardTitle>
            <p className="text-gray-600">জলধারা Water Delivery App</p>
            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardHeader>

          <CardContent className="prose prose-gray max-w-none space-y-8">
            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the জলধারা Water Delivery App ("App"),
                you accept and agree to be bound by the terms and provision of
                this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                জলধারা provides water delivery services through our mobile
                application. We offer both home delivery and takeaway options
                for purified water in 20L jars to customers in specified service
                areas.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Provide accurate and complete information when creating an
                  account
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>
                  Be available to receive deliveries at the specified address
                  and time
                </li>
                <li>
                  Handle water jars with care and return empty jars as requested
                </li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Payment Terms
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment is due upon delivery or pickup</li>
                <li>We accept cash payments</li>
                <li>Prices are subject to change with notice</li>
                <li>No refunds for delivered products unless defective</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                জলধারা shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Contact Information
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us
                  at:
                  <br />
                  <strong>Email:</strong> contact@nextcoder.co.in
                  <br />
                  <strong>Phone:</strong> +91 7001070713
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
