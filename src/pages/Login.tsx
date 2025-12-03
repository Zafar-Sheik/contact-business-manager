"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Lock, User, Building } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8">
        {/* Left side - Brand and Welcome Section */}
        <div className="lg:w-1/2 max-w-lg">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contact Computers
                </h1>
                <p className="text-gray-600">Business Management Suite</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Secure Access
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Access your business management dashboard with
                  enterprise-grade security. All data is encrypted and
                  protected.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-lg font-semibold mb-3">
                  Everything in One Place
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white mr-2"></div>
                    Invoice & Financial Management
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white mr-2"></div>
                    Customer Relationship Tracking
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white mr-2"></div>
                    Stock & Inventory Control
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white mr-2"></div>
                    Real-time Business Analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats/Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-600">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">AES-256</div>
                <div className="text-xs text-gray-600">Encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="lg:w-1/2 max-w-md">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Admin Access
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Secure Login
                    </span>
                  </div>
                </div>

                <Auth
                  supabaseClient={supabase}
                  providers={[]}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "rgb(37, 99, 235)", // blue-600
                          brandAccent: "rgb(126, 34, 206)", // purple-700
                          inputBackground: "rgb(249, 250, 251)",
                          inputBorder: "rgb(229, 231, 235)",
                          inputBorderHover: "rgb(209, 213, 219)",
                          inputBorderFocus: "rgb(37, 99, 235)",
                          inputText: "rgb(17, 24, 39)",
                          inputLabelText: "rgb(75, 85, 99)",
                          inputPlaceholder: "rgb(156, 163, 175)",
                          messageText: "rgb(239, 68, 68)",
                          messageTextDanger: "rgb(239, 68, 68)",
                          anchorTextColor: "rgb(37, 99, 235)",
                          anchorTextHoverColor: "rgb(29, 78, 216)",
                        },
                        radii: {
                          borderRadiusButton: "0.75rem",
                          buttonBorderRadius: "0.75rem",
                          inputBorderRadius: "0.75rem",
                        },
                        space: {
                          buttonPadding: "0.875rem 1.5rem",
                          inputPadding: "0.875rem 1rem",
                        },
                        fontSizes: {
                          baseBodySize: "0.875rem",
                          baseInputSize: "0.875rem",
                          baseLabelSize: "0.875rem",
                          baseButtonSize: "0.875rem",
                        },
                      },
                    },
                    className: {
                      container: "space-y-4",
                      button:
                        "w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 rounded-xl",
                      input:
                        "h-11 bg-gray-50 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl pl-10",
                      label: "text-sm font-medium text-gray-700 mb-1",
                      message: "text-sm rounded-lg p-3",
                      divider: "hidden",
                      anchor:
                        "text-sm text-blue-600 hover:text-blue-700 font-medium",
                    },
                  }}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: "Email Address",
                        password_label: "Password",
                        email_input_placeholder: "Enter your email",
                        password_input_placeholder: "Enter your password",
                        button_label: "Sign In",
                        loading_button_label: "Signing In...",
                      },
                    },
                  }}
                  theme="light"
                  redirectTo={window.location.origin}
                />
              </div>

              {/* Custom Password Toggle (for demonstration) */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-center">
                  <Separator className="w-1/4" />
                  <span className="px-4 text-sm text-gray-500">Quick Tips</span>
                  <Separator className="w-1/4" />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-2">
                    <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                      <Lock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Session Security
                      </p>
                      <p className="text-xs text-gray-600">
                        Your session is automatically remembered unless you
                        explicitly sign out. Always sign out when using shared
                        devices.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Secure Connection</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Encrypted Data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@contactcomputers.co.za"
              className="text-blue-600 hover:text-blue-700 font-medium">
              support@contactcomputers.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
