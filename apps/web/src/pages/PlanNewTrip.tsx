import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Leaf, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Wand2 
} from 'lucide-react';

export const PlanNewTrip: React.FC = () => {
  const { createTrip } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('Kyoto');
  const [country, setCountry] = useState('Japan');
  const [title, setTitle] = useState('Kyoto Serene Gardens & Bamboo Trail');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState(2500);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Eco-Friendly', 'Culture']);
  const [description, setDescription] = useState('Explore traditional wooden temples, organic tea farms, and bamboo groves.');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200');

  const popularDestinations = [
    { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600' },
    { city: 'Positano', country: 'Italy', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600' },
    { city: 'Interlaken', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=600' },
    { city: 'Reykjavik', country: 'Iceland', img: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=600' },
    { city: 'Ubud', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600' }
  ];

  const travelStylesList = ['Eco-Friendly', 'Culinary', 'Heritage & Culture', 'Hiking & Trails', 'Budget conscious', 'Relaxation', 'Luxury'];

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleSelectDestination = (city: string, cntry: string, img: string) => {
    setDestination(city);
    setCountry(cntry);
    setCoverImage(img);
    setTitle(`${city} Mindful Exploration`);
  };

  const handleComplete = () => {
    const created = createTrip({
      title,
      destination,
      country,
      coverImage,
      startDate,
      endDate,
      status: 'upcoming',
      budget,
      travelersCount,
      travelStyle: selectedStyles,
      description,
      daysCount: 7,
      isPublic: true
    });
    navigate(`/trips/${created.id}/builder`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/20 text-primary border-2 border-on-surface rounded-full text-xs font-heading font-bold">
          <Wand2 className="w-4 h-4" />
          <span>AI-Powered Itinerary Generator</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-on-surface">Plan Your Next Trip</h1>
        <p className="text-xs text-on-surface-variant">Step-by-step zero-carbon travel setup</p>
      </div>

      {/* Stepper Progress */}
      <div className="flex justify-between items-center bg-surface-container-low p-4 neo-brutal-card-static">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full border-2 border-on-surface flex items-center justify-center font-heading font-bold text-xs ${
              step === i ? 'bg-primary text-white shadow-brutal-sm' :
              step > i ? 'bg-secondary text-white' : 'bg-surface text-on-surface-variant'
            }`}>
              {step > i ? <Check className="w-4 h-4" /> : i}
            </div>
            <span className="hidden sm:inline text-xs font-heading font-bold text-on-surface">
              {i === 1 ? 'Destination' : i === 2 ? 'Dates & People' : i === 3 ? 'Budget & Style' : 'Generate'}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="neo-brutal-card p-6 sm:p-8 bg-surface-container-low space-y-6">
        
        {/* Step 1: Destination Selection */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="font-heading font-extrabold text-xl text-on-surface flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Where do you want to go?</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-on-surface">Trip Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm neo-brutal-input font-bold"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {popularDestinations.map(d => (
                <button
                  key={d.city}
                  type="button"
                  onClick={() => handleSelectDestination(d.city, d.country, d.img)}
                  className={`neo-brutal-card p-2 bg-surface text-left overflow-hidden relative group border-2 ${
                    destination === d.city ? 'border-primary ring-2 ring-primary bg-primary-container/20' : ''
                  }`}
                >
                  <img src={d.img} alt={d.city} className="w-full h-24 object-cover rounded-md border border-on-surface mb-2" />
                  <span className="block font-heading font-extrabold text-sm text-on-surface">{d.city}</span>
                  <span className="block text-[10px] text-on-surface-variant">{d.country}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Dates & Travelers */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="font-heading font-extrabold text-xl text-on-surface flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Dates & Companions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-heading font-bold text-on-surface">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm neo-brutal-input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-heading font-bold text-on-surface">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm neo-brutal-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-on-surface flex justify-between">
                <span>Number of Travelers</span>
                <span className="text-primary font-bold">{travelersCount} Person(s)</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="10"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* Step 3: Budget & Travel Style */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-heading font-extrabold text-xl text-on-surface flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-secondary" />
              <span>Budget & Vibe</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-on-surface flex justify-between">
                <span>Target Total Budget (USD)</span>
                <span className="text-secondary font-extrabold text-base">${budget}</span>
              </label>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="250"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-secondary"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-on-surface">Travel Style Tags</label>
              <div className="flex flex-wrap gap-2">
                {travelStylesList.map(style => {
                  const active = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all ${
                        active 
                          ? 'bg-secondary text-white border-on-surface shadow-brutal-sm' 
                          : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {style} {active && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Finalize & Generate */}
        {step === 4 && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-primary-container text-white border-4 border-on-surface shadow-brutal rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-on-surface">Ready to Generate Itinerary</h3>
            
            <div className="bg-surface p-4 neo-brutal-card-static text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-on-surface/20 pb-1">
                <span className="font-bold">Destination:</span>
                <span>{destination}, {country}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/20 pb-1">
                <span className="font-bold">Dates:</span>
                <span>{startDate} to {endDate}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/20 pb-1">
                <span className="font-bold">Travelers:</span>
                <span>{travelersCount} people</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Budget:</span>
                <span className="font-bold text-primary">${budget}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant">
              Globe Trotter AI will generate zero-carbon, authentic local day-by-day activities based on your selected vibe.
            </p>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-on-surface/20">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={() => setStep(step - 1)}
              className="neo-brutal-btn-white px-4 py-2 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              type="button" 
              onClick={() => setStep(step + 1)}
              className="neo-brutal-btn-primary px-5 py-2 text-xs flex items-center gap-1"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleComplete}
              className="neo-brutal-btn-primary px-6 py-2.5 text-sm flex items-center gap-2 shadow-brutal"
            >
              <Wand2 className="w-4 h-4" />
              <span>Build Itinerary Now</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
