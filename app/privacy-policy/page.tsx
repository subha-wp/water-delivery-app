import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - জলধারা",
  description: "Privacy Policy for জলধারা Water Delivery App",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to জলধারা ("we," "our," or "us"). We are committed to
                protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our mobile application জলধারা Water Delivery App (the "App")
                and related services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our App, you agree to the collection and use of
                information in accordance with this Privacy Policy. If you do
                not agree with our policies and practices, please do not use our
                App.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-3">
                We collect the following personal information when you register
                and use our App:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Contact Information:</strong> Name, phone number,
                  delivery address
                </li>
                <li>
                  <strong>Account Information:</strong> Username, password
                  (encrypted), account preferences
                </li>
                <li>
                  <strong>Order Information:</strong> Order history, delivery
                  preferences, payment information
                </li>
                <li>
                  <strong>Location Data:</strong> Delivery address and location
                  for service provision
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
                2.2 Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Device Information:</strong> Device type, operating
                  system, unique device identifiers
                </li>
                <li>
                  <strong>Usage Data:</strong> App usage patterns, features
                  accessed, time spent in app
                </li>
                <li>
                  <strong>Log Data:</strong> IP address, access times, app
                  crashes, performance data
                </li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
                2.3 Cookies and Tracking Technologies
              </h3>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze app usage, and improve our services. You can
                control cookie preferences through your device settings.
              </p>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Service Provision:</strong> Process orders, arrange
                  deliveries, manage your account
                </li>
                <li>
                  <strong>Communication:</strong> Send order updates, delivery
                  notifications, customer support
                </li>
                <li>
                  <strong>Improvement:</strong> Analyze usage patterns to
                  improve app functionality and user experience
                </li>
                <li>
                  <strong>Security:</strong> Protect against fraud, unauthorized
                  access, and security threats
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Comply with applicable laws
                  and regulations
                </li>
                <li>
                  <strong>Marketing:</strong> Send promotional offers and
                  updates (with your consent)
                </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We may share your information with trusted third-party service
                providers who assist us in operating our App and providing
                services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Delivery personnel for order fulfillment</li>
                <li>Payment processors for transaction processing</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Analytics providers for app improvement</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law or to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Comply with legal processes or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Prevent fraud or security threats</li>
                <li>Enforce our terms of service</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred as part of the business
                transaction.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Encryption:</strong> Data transmission and storage
                  encryption
                </li>
                <li>
                  <strong>Access Controls:</strong> Limited access to personal
                  information on a need-to-know basis
                </li>
                <li>
                  <strong>Regular Audits:</strong> Security assessments and
                  vulnerability testing
                </li>
                <li>
                  <strong>Secure Infrastructure:</strong> Protected servers and
                  databases
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to protect
                your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Account Information:</strong> Retained while your
                  account is active
                </li>
                <li>
                  <strong>Order History:</strong> Retained for 3 years for
                  business and legal purposes
                </li>
                <li>
                  <strong>Usage Data:</strong> Retained for 2 years for
                  analytics and improvement
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Retained as required by
                  applicable laws
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Access:</strong> Request access to your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Restriction:</strong> Request limitation of processing
                  activities
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us using the
                information provided in the "Contact Us" section.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our App is not intended for children under the age of 13. We do
                not knowingly collect personal information from children under
                13. If we become aware that we have collected personal
                information from a child under 13, we will take steps to delete
                such information promptly.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure that
                such transfers comply with applicable data protection laws and
                implement appropriate safeguards to protect your information.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Third-Party Links and Services
              </h2>
              <p className="text-gray-700">
                Our App may contain links to third-party websites or services.
                We are not responsible for the privacy practices of these third
                parties. We encourage you to review their privacy policies
                before providing any personal information.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy in the App and updating the "Last updated" date. Your
                continued use of the App after such changes constitutes
                acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  জলধারা Water Delivery Service
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> contact@nextcoder.co.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +7001070713
                  </p>
                  <p>
                    <strong>Address:</strong> jadab nagar, kulpi
                  </p>
                  <p>
                    <strong>Business Hours:</strong> 9:00 AM - 6:00 PM (Monday
                    to Saturday)
                  </p>
                </div>
              </div>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Regulatory Compliance
              </h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy is designed to comply with applicable data
                protection regulations, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Google Play Developer Policy</li>
                <li>Local data protection laws in Bangladesh</li>
              </ul>
            </section>

            {/* Consent */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Consent
              </h2>
              <p className="text-gray-700">
                By using our App, you consent to the collection, use, and
                disclosure of your information as described in this Privacy
                Policy. If you do not agree with this Privacy Policy, please do
                not use our App.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
