'use client';

import { motion } from 'framer-motion';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200" />
      <div className="space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={event.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative flex items-center"
          >
            <div className="flex-1 text-right pr-8">
              <div className="font-bold text-2xl text-primary">{event.year}</div>
              <h3 className="font-semibold mb-1">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white" />
            <div className="flex-1 pl-8" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}