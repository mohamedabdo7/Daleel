"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROUTES } from "@/app/constants/routes";
import { Calendar, MapPin } from "lucide-react";

type Event = {
  id: number;
  title: string;
  desc: string;
  image: string;
  images?: Array<{
    id: number;
    image: string;
  }>;
  buttons?: Array<{
    id: number;
    title: string;
    link: string;
  }>;
};

export default function EventCard({ event }: { event: Event }) {
  // detect lang from dynamic route (e.g. /en/... or /ar/...)
  const params = useParams();
  const lang = (params?.lang as string) ?? "en"; // fallback if no lang provided

  // use central ROUTES + lang prefix (encode id because it may contain special chars)
  const href = `/${lang}${ROUTES.EVENTS || "/events"}/${encodeURIComponent(
    event.id.toString()
  )}`;

  // Extract first few lines of description for preview
  const shortDesc = event.desc
    ? event.desc.split("\n").slice(0, 3).join(" ").substring(0, 150) + "..."
    : "";

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {event.image ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Event badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-800">
                <Calendar className="h-3 w-3" />
                Event
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-80" />
              <span className="text-sm font-medium">Event</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {shortDesc && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {shortDesc}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.buttons &&
            event.buttons.slice(0, 2).map((button) => (
              <a
                key={button.id}
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {button.title}
              </a>
            ))}
        </div>

        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 transform duration-200"
        >
          Learn more
          <svg
            className="ml-1 h-4 w-4 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
