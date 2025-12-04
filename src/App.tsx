import React, { useState } from 'react';
import { BookOpen, Calculator, Check, X, ArrowRight, RotateCcw, BarChart3, ArrowUpDown, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Lesson {
  id: number;
  title: string;
  category: string;
  description: string;
  instruction: string;
  setup: { [key: string]: string };
  answer: string;
  targetCell: string;
  explanation: string;
  hasChart?: boolean;
  hasSorting?: boolean;
  hasFiltering?: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface SelectedCell {
  row: number;
  col: number;
}

const App: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [grid, setGrid] = useState<string[][]>(Array(10).fill(null).map(() => Array(6).fill('')));
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Basic Cell References",
      category: "basics",
      description: "Learn how to reference cells in formulas",
      instruction: "In cell C2, enter a formula to add A2 and B2",
      setup: { A2: '10', B2: '20' },
      answer: '=A2+B2',
      targetCell: 'C2',
      explanation: "Cell references let you use values from other cells. Format: =A2+B2"
    },
    {
      id: 2,
      title: "Relative Cell References",
      category: "references",
      description: "References that change when copied",
      instruction: "In cell C2, multiply A2 by B2. Notice how the reference is relative.",
      setup: { A2: '5', B2: '3', A3: '10', B3: '4' },
      answer: '=A2*B2',
      targetCell: 'C2',
      explanation: "Relative references (A2) change when you copy the formula. If you copy =A2*B2 from C2 to C3, it becomes =A3*B3"
    },
    {
      id: 3,
      title: "Absolute Cell References",
      category: "references",
      description: "References that stay fixed when copied",
      instruction: "In cell C2, multiply A2 by the tax rate in B5 using absolute reference $B$5",
      setup: { A2: '100', B5: '0.15' },
      answer: '=A2*$B$5',
      targetCell: 'C2',
      explanation: "Absolute references ($B$5) stay fixed when copied. Use $ before column and row to lock them."
    },
    {
      id: 4,
      title: "Mixed Cell References",
      category: "references",
      description: "Lock only row or column",
      instruction: "In cell C2, create a formula using mixed reference $A2 (fixed column, relative row)",
      setup: { A2: '25', B2: '2' },
      answer: '=$A2*B2',
      targetCell: 'C2',
      explanation: "Mixed references lock either column ($A2) or row (A$2). $A2 keeps column A fixed but row changes when copied down."
    },
    {
      id: 5,
      title: "SUM Function",
      category: "basics",
      description: "Calculate totals using SUM",
      instruction: "In cell A6, use SUM to add A2 through A5",
      setup: { A2: '15', A3: '25', A4: '10', A5: '30' },
      answer: '=SUM(A2:A5)',
      targetCell: 'A6',
      explanation: "SUM adds a range of cells. Format: =SUM(A2:A5)"
    },
    {
      id: 6,
      title: "AVERAGE Function",
      category: "basics",
      description: "Find the mean of numbers",
      instruction: "In cell B6, find the average of B2 through B5",
      setup: { B2: '80', B3: '90', B4: '70', B5: '85' },
      answer: '=AVERAGE(B2:B5)',
      targetCell: 'B6',
      explanation: "AVERAGE calculates the mean. Format: =AVERAGE(B2:B5)"
    },
    {
      id: 7,
      title: "MAX and MIN Functions",
      category: "basics",
      description: "Find highest and lowest values",
      instruction: "In cell C6, find the maximum of C2 through C5",
      setup: { C2: '45', C3: '67', C4: '23', C5: '89' },
      answer: '=MAX(C2:C5)',
      targetCell: 'C6',
      explanation: "MAX finds the largest value, MIN finds the smallest. Format: =MAX(C2:C5)"
    },
    {
      id: 8,
      title: "COUNT and COUNTA",
      category: "basics",
      description: "Count cells with numbers or data",
      instruction: "In cell D6, count how many numbers are in D2 to D5",
      setup: { D2: '5', D3: '10', D4: '15', D5: '20' },
      answer: '=COUNT(D2:D5)',
      targetCell: 'D6',
      explanation: "COUNT counts cells with numbers. COUNTA counts non-empty cells. Format: =COUNT(D2:D5)"
    },
    {
      id: 9,
      title: "Create a Bar Chart",
      category: "charts",
      description: "Visualize data with charts",
      instruction: "Enter product sales data, then click 'Show Chart' to see a bar chart",
      setup: { A2: 'Apples', B2: '45', A3: 'Oranges', B3: '38', A4: 'Bananas', B4: '52' },
      answer: 'CHART',
      targetCell: 'A1',
      explanation: "Charts help visualize data patterns. Select your data range to create different chart types.",
      hasChart: true
    },
    {
      id: 10,
      title: "Sorting Data",
      category: "sorting",
      description: "Organize data in order",
      instruction: "Click 'Sort Ascending' to arrange column B from lowest to highest",
      setup: { A2: 'John', B2: '85', A3: 'Sarah', B3: '92', A4: 'Mike', B4: '78', A5: 'Emma', B5: '95' },
      answer: 'SORT',
      targetCell: 'A1',
      explanation: "Sorting arranges data in ascending (low to high) or descending (high to low) order.",
      hasSorting: true
    },
    {
      id: 11,
      title: "Filtering Data",
      category: "filtering",
      description: "Show only specific data",
      instruction: "Use the filter box to show only scores above 85",
      setup: { A2: 'John', B2: '85', A3: 'Sarah', B3: '92', A4: 'Mike', B4: '78', A5: 'Emma', B5: '95' },
      answer: 'FILTER',
      targetCell: 'A1',
      explanation: "Filtering displays only rows that meet your criteria, hiding the rest temporarily.",
      hasFiltering: true
    }
  ];

  const columnLabels: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  const COLORS: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa', '#fb923c'];

  const startLesson = (lesson: Lesson): void => {
    setActiveLesson(lesson);
    const newGrid: string[][] = Array(10).fill(null).map(() => Array(6).fill(''));

    Object.entries(lesson.setup).forEach(([cell, value]) => {
      const col = cell.charCodeAt(0) - 65;
      const row = parseInt(cell.slice(1)) - 1;
      newGrid[row][col] = value;
    });

    setGrid(newGrid);
    setSelectedCell(null);
    setShowChart(false);
    setSortOrder(null);
    setFilterValue('');
  };

  const handleCellChange = (row: number, col: number, value: string): void => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
    setSelectedCell({ row, col });
  };

  const checkAnswer = (): void => {
    if (!activeLesson) return;

    if (activeLesson.hasChart) {
      setShowChart(true);
      setScore(score + 1);
      setAttempts(attempts + 1);
      alert('🎉 Great! Check out the chart visualization below!');
      return;
    }

    if (activeLesson.hasSorting || activeLesson.hasFiltering) {
      setScore(score + 1);
      setAttempts(attempts + 1);
      alert('🎉 Correct! You\'ve successfully used this feature!');
      return;
    }

    const targetCol = activeLesson.targetCell.charCodeAt(0) - 65;
    const targetRow = parseInt(activeLesson.targetCell.slice(1)) - 1;
    const userAnswer = grid[targetRow][targetCol].toUpperCase().replace(/\s/g, '');
    const correctAnswer = activeLesson.answer.toUpperCase().replace(/\s/g, '');

    setAttempts(attempts + 1);

    if (userAnswer === correctAnswer) {
      setScore(score + 1);
      alert('🎉 Correct! Well done!');
    } else {
      alert(`❌ Not quite. Try again! Hint: ${activeLesson.explanation}`);
    }
  };

  const resetLesson = (): void => {
    if (activeLesson) {
      startLesson(activeLesson);
    }
  };

  const getCellStyle = (row: number, col: number): string => {
    if (!activeLesson) return 'bg-white';

    const targetCol = activeLesson.targetCell.charCodeAt(0) - 65;
    const targetRow = parseInt(activeLesson.targetCell.slice(1)) - 1;

    if (row === targetRow && col === targetCol) {
      return 'bg-yellow-100 border-yellow-400';
    }

    const cellRef = columnLabels[col] + (row + 1);
    if (activeLesson.setup[cellRef]) {
      return 'bg-blue-50 border-blue-300';
    }

    return 'bg-white';
  };

  const getChartData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    for (let i = 1; i < 6; i++) {
      if (grid[i][0] && grid[i][1]) {
        data.push({
          name: grid[i][0],
          value: parseFloat(grid[i][1]) || 0
        });
      }
    }
    return data;
  };

  const sortData = (order: string): void => {
    const newGrid = [...grid];
    const dataRows: string[][] = [];

    for (let i = 1; i < 6; i++) {
      if (newGrid[i][0] || newGrid[i][1]) {
        dataRows.push([newGrid[i][0], newGrid[i][1]]);
      }
    }

    dataRows.sort((a, b) => {
      const valA = parseFloat(a[1]) || 0;
      const valB = parseFloat(b[1]) || 0;
      return order === 'asc' ? valA - valB : valB - valA;
    });

    for (let i = 0; i < 5; i++) {
      newGrid[i + 1][0] = '';
      newGrid[i + 1][1] = '';
    }

    dataRows.forEach((row, idx) => {
      newGrid[idx + 1][0] = row[0];
      newGrid[idx + 1][1] = row[1];
    });

    setGrid(newGrid);
    setSortOrder(order);
  };

  const getFilteredRows = (): string[][] => {
    if (!filterValue) return grid;

    const threshold = parseFloat(filterValue);
    if (isNaN(threshold)) return grid;

    const newGrid = [...grid];
    return newGrid.map((row, idx) => {
      if (idx === 0) return row;
      const value = parseFloat(row[1]);
      if (!isNaN(value) && value > threshold) return row;
      return Array(6).fill('');
    });
  };

  const categoryIcons: { [key: string]: any } = {
    basics: Calculator,
    references: BookOpen,
    charts: BarChart3,
    sorting: ArrowUpDown,
    filtering: Filter
  };

  const categories: Category[] = [
    { id: 'basics', name: 'Basic Functions', color: 'indigo' },
    { id: 'references', name: 'Cell References', color: 'purple' },
    { id: 'charts', name: 'Charts & Graphs', color: 'green' },
    { id: 'sorting', name: 'Sorting', color: 'orange' },
    { id: 'filtering', name: 'Filtering', color: 'pink' }
  ];

  return (
    <div className="  max-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 md:w-10 h-8 md:h-10 text-indigo-600" />
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">SEFWI -BEKWAI SENIOR HIGH SCHOOL - SPREADSHEET PRACTICE</h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">Master spreadsheet formulas, charts, and data management for your exams!</p>

          <div className="mt-4 flex flex-row gap-4 text-sm justify-center ">
            <div className="bg-indigo-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-indigo-800 card">Score: {score}/{attempts}</span>
            </div>
            <div className="bg-purple-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-purple-800 card">Lessons Completed: {score}</span>
            </div>
          </div>
        </div>

        {!activeLesson ? (
          <div>
            {categories.map((category) => {
              const categoryLessons = lessons.filter(l => l.category === category.id);
              if (categoryLessons.length === 0) return null;

              const Icon = categoryIcons[category.id];

              return (
                <div key={category.id} className="m-10">
                  <div className="flex items-center gap-2 mb-4 card">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-800 ">{category.name}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border-l-4 border-${category.color}-500`}
                        onClick={() => startLesson(lesson)}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className={`w-6 h-6 text-${category.color}-600 flex-shrink-0 mt-1`} />
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                            <p className="text-gray-600 text-sm">{lesson.description}</p>
                          </div>
                        </div>
                        <div className={`mt-4 flex items-center text-${category.color}-600 font-semibold`}>
                          <span>Start Lesson</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 card">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{activeLesson.title}</h2>
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-4">
                  <p className="text-gray-700 font-semibold text-sm md:text-base">{activeLesson.instruction}</p>
                </div>
                <p className="text-sm text-gray-600">
                  💡 <strong>Hint:</strong> {activeLesson.explanation}
                </p>
              </div>

              {activeLesson.hasSorting && (
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => sortData('asc')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Sort Ascending
                  </button>
                  <button
                    onClick={() => sortData('desc')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Sort Descending
                  </button>
                </div>
              )}

              {activeLesson.hasFiltering && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Filter scores greater than:
                  </label>
                  <input
                    type="number"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-4 py-2 w-40"
                    placeholder="Enter value"
                  />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-400 bg-gray-200 p-2 w-12 text-center font-bold text-sm"></th>
                      {columnLabels.map((label) => (
                        <th key={label} className="border-2 border-gray-400 bg-gray-200 p-2 w-20 md:w-24 text-center font-bold text-sm">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeLesson.hasFiltering ? getFilteredRows() : grid).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border-2 border-gray-400 bg-gray-200 p-2 text-center font-bold text-sm">
                          {rowIndex + 1}
                        </td>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className={`border-2 p-0 ${getCellStyle(rowIndex, colIndex)}`}>
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                              className="w-full h-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder=""
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={checkAnswer}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 font-semibold shadow-lg text-sm"
                >
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  {activeLesson.hasChart ? 'Show Chart' : 'Check Answer'}
                </button>
                <button
                  onClick={resetLesson}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 font-semibold shadow-lg text-sm"
                >
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                  Reset
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-lg text-sm"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                  Back to Lessons
                </button>
              </div>

              {showChart && activeLesson.hasChart && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Data Visualization</h3>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-2">Bar Chart</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-2">Line Chart</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Pie Chart</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getChartData().map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Quick Reference</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2 text-sm">Basic Operators</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                    <li><code className="bg-white px-2 py-1 rounded">+</code> Addition</li>
                    <li><code className="bg-white px-2 py-1 rounded">-</code> Subtraction</li>
                    <li><code className="bg-white px-2 py-1 rounded">*</code> Multiplication</li>
                    <li><code className="bg-white px-2 py-1 rounded">/</code> Division</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-2 text-sm">Cell Reference Types</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-2">
                    <li><strong>Relative:</strong> <code className="bg-white px-1 rounded">A2</code> - Changes when copied</li>
                    <li><strong>Absolute:</strong> <code className="bg-white px-1 rounded">$A$2</code> - Stays fixed</li>
                    <li><strong>Mixed:</strong> <code className="bg-white px-1 rounded">$A2</code> or <code className="bg-white px-1 rounded">A$2</code> - Locks one dimension</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2 text-sm">Common Functions</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                    <li><code className="bg-white px-2 py-1 rounded">SUM()</code> Add numbers</li>
                    <li><code className="bg-white px-2 py-1 rounded">AVERAGE()</code> Mean value</li>
                    <li><code className="bg-white px-2 py-1 rounded">MAX()</code> Highest value</li>
                    <li><code className="bg-white px-2 py-1 rounded">MIN()</code> Lowest value</li>
                    <li><code className="bg-white px-2 py-1 rounded">COUNT()</code> Count numbers</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-bold text-orange-900 mb-2 text-sm">Data Management</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-2">
                    <li><strong>Sorting:</strong> Arrange data in order (ascending/descending)</li>
                    <li><strong>Filtering:</strong> Display only matching rows</li>
                    <li><strong>Charts:</strong> Visualize data patterns</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-900 mb-2 text-sm">Tips</h4>
                  <ul className="text-xs md:text-sm text-gray-700 space-y-2">
                    <li>✓ Start formulas with <code className="bg-white px-1 rounded">=</code></li>
                    <li>✓ Use <code className="bg-white px-1 rounded">:</code> for ranges (A2:A5)</li>
                    <li>✓ Use $ to lock references</li>
                    <li>✓ Yellow cells = answer cells</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;