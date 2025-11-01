import TestimonialSlider from '../components/TestimonialSlider.tsx';

export default function TestimonialsSection() {
  return (
    <section id='testimonials' className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why clients <span className="text-purple-600">love</span><br/>working with us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>

        <TestimonialSlider />
      </div>
    </section>
  );
}