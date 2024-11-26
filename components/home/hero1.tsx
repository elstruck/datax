'use client';

import { ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Hero1 = () => {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              New Release
              <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              Welcome to DATAx
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              Where all your dreams come true, with data.
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <a href="#">
                <Button className="w-full sm:w-auto">
                  Get Started
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" className="w-full sm:w-auto">
                  Learn More
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </a>
            </div>
          </div>
          <img
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder hero"
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;