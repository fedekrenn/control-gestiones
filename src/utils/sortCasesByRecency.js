export const sortCasesByRecency = (cases) => [...cases].sort((a, b) => b.timestamp - a.timestamp)
