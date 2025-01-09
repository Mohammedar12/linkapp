import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for starters",
    features: [
      "20 Wasl link",
      "Basic analytics",
      "Custom URL",
      "Mobile-friendly page",
    ],
  },
  {
    name: "Pro",
    price: "$4.99",
    description: "For growing creators",
    features: [
      "Unlimited Wasl links",
      "Advanced analytics",
      "Priority support",
      "Custom themes",
      "Remove Wasl branding",
    ],
  },
];

export default function PricingPage() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter text-secondary-foreground sm:text-5xl ">
              Choose Your Plan
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Select the perfect plan for your needs and start connecting your
              digital world with Wasl.
            </p>
          </div>
        </div>
        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col p-6 rounded-lg shadow-lg bg-secondary"
            >
              <h3 className="text-2xl font-bold text-card-foreground">
                {plan.name}
              </h3>
              <div className="mt-4 text-4xl font-bold text-primary">
                {plan.price}
              </div>
              <p className="mt-2 text-muted-foreground">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="w-5 h-5 mr-2 text-primary" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="py-6 mt-6 rounded-2xl"
                variant={plan.name === "Pro" ? "default" : "secondary"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
