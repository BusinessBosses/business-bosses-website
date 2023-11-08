const formatCount = (count: number): string => {
    if (count >= 1000000) {
      const countInM = (count / 1000000).toFixed(1);
      return `${countInM}m`;
    } else if (count >= 1000) {
      const countInK = (count / 1000).toFixed(1);
      return `${countInK}k`;
    } else {
      return count.toString();
    }
  };
  
  export default formatCount;
  