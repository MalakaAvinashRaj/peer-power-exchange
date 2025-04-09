
import React from 'react';

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '5,000+', label: 'Skills Shared' },
  { value: '25,000+', label: 'Sessions Completed' },
  { value: '120+', label: 'Countries' }
];

const StatsSection = () => {
  return (
    <section className="py-12 bg-gray-50 border-y">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-skillsync-blue to-skillsync-purple bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
