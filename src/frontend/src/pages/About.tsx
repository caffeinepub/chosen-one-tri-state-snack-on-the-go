import { MapPin, Calendar, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            Est. 2026
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-display text-primary mb-4">
          About Chosen One
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tri-State Snack on the Go
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-8 border-2 border-primary/20 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                At Chosen One, we believe everyone deserves access to delicious, quality snacks wherever they are. 
                Founded in 2026, we're revolutionizing the way the Tri-State area enjoys their favorite treats.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Our mobile snack service brings the convenience of a full snack selection directly to your neighborhood, 
                event, or workplace. No more settling for whatever's available at the corner store—we bring the best 
                selection right to your doorstep.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Why Choose Chosen One?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Selection</h3>
              <p className="text-muted-foreground">
                Carefully curated snacks from top brands and local favorites. We only stock what we'd eat ourselves.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="bg-secondary/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mobile Convenience</h3>
              <p className="text-muted-foreground">
                We come to you! Whether it's your office, event, or neighborhood, enjoy fresh snacks without leaving.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-muted-foreground">
                Locally owned and operated. We're your neighbors, committed to serving our community with excellence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Area Section */}
      <Card className="mb-8 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-secondary/10">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-accent/20 p-4 rounded-full mb-4">
              <MapPin className="h-8 w-8 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">We Serve the Tri-State Area</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Proudly bringing delicious snacks to communities across Mississippi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-card border-2 border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
              <h3 className="text-2xl font-bold text-primary mb-2">Southaven</h3>
              <p className="text-sm text-muted-foreground">Mississippi</p>
            </div>
            <div className="bg-card border-2 border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
              <h3 className="text-2xl font-bold text-primary mb-2">Horn Lake</h3>
              <p className="text-sm text-muted-foreground">Mississippi</p>
            </div>
            <div className="bg-card border-2 border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
              <h3 className="text-2xl font-bold text-primary mb-2">Olive Branch</h3>
              <p className="text-sm text-muted-foreground">Mississippi</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Can't find your location? Contact us—we're always looking to expand our service area!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card className="border-2">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              Chosen One was born from a simple observation: people love great snacks, but accessing them 
              shouldn't require a trip to the store. In 2026, we launched our mobile snack service with a 
              mission to bring joy, convenience, and quality treats directly to the communities we serve.
            </p>
            <p>
              What started as a single food truck serving Southaven has grown into a beloved tri-state 
              operation. We've built relationships with local businesses, schools, and event organizers who 
              trust us to deliver not just snacks, but smiles and satisfaction.
            </p>
            <p>
              Every item in our catalog is hand-selected. We taste-test everything, negotiate with suppliers 
              for the best prices, and ensure freshness with every delivery. When you order from Chosen One, 
              you're not just getting snacks—you're getting a service that cares about your experience from 
              start to finish.
            </p>
            <p className="font-semibold text-primary">
              Thank you for choosing Chosen One. We're honored to be your go-to snack provider in the Tri-State area!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
