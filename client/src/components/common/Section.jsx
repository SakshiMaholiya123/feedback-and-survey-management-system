// Section.jsx
 const Section = ({ title, icon, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
      {icon} {title}
    </h2>
    {children}
  </section>
);
export default Section;