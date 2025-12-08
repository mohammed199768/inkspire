"use client";

import { reviews } from "@/data/staticData";
import SectionTitle from "@/components/ui/SectionTitle";
import { Star } from "lucide-react";
import { useGSAPFade } from "@/hooks/useGSAPFade";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromReview } from "@/lib/popupMappers";

export default function TestimonialsSection() {
    const containerRef = useGSAPFade();
    const { openPopup } = usePopup();

    return (
        <div ref={containerRef} className="min-h-[80vh] flex flex-col justify-center py-20 px-6">
            <SectionTitle title="Client" highlight="Stories" highlightColor="text-yellow-400" />
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, i) => (
                    <div
                        key={i}
                        onClick={() => openPopup(buildPopupFromReview(review))}
                        className="fade-up p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-all duration-300 relative cursor-pointer"
                    >
                        <div className="flex gap-1 mb-6 text-yellow-400">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">"{review.text}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <p className="text-sm text-gray-500">{review.company}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
