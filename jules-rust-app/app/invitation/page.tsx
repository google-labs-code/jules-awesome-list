import InvitationHero from "@/components/InvitationHero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invitation | NanoBanana",
    description: "An exclusive invitation crafted by NanoBanana Gene.",
};

export default function InvitationPage() {
    return (
        <main className="w-full min-h-screen bg-black">
            <InvitationHero />
        </main>
    );
}
