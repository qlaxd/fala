import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface PartnerCardProps {
  name: string;
  location: string;
  description: string;
  website: string;
  image: string;
}

export function PartnerCard({
  name,
  location,
  description,
  website,
  image,
}: PartnerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">{description}</p>
        <Button 
          asChild 
          variant="outline"
          className="shadow hover:shadow-md transition-shadow"
        >
          <a href={website} target="_blank" rel="noopener noreferrer">
            Visit Website
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}