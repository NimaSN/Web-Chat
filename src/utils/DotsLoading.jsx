const DotsLoading = () => {
  const dotsColor = "#0ea5e9";
  return (
    <div className="loading-dots">
      <div
        className="loading-dots--dot"
        style={{ backgroundColor: dotsColor }}
      ></div>
      <div
        className="loading-dots--dot"
        style={{ backgroundColor: dotsColor }}
      ></div>
      <div
        className="loading-dots--dot"
        style={{ backgroundColor: dotsColor }}
      ></div>
    </div>
  );
};

export default DotsLoading;
