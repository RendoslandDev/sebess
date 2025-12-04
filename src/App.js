import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BookOpen, Calculator, Check, X, ArrowRight, RotateCcw, BarChart3, ArrowUpDown, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const App = () => {
    const [activeLesson, setActiveLesson] = useState(null);
    const [grid, setGrid] = useState(Array(10).fill(null).map(() => Array(6).fill('')));
    const [selectedCell, setSelectedCell] = useState(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showChart, setShowChart] = useState(false);
    const [sortOrder, setSortOrder] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const lessons = [
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
    const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa', '#fb923c'];
    const startLesson = (lesson) => {
        setActiveLesson(lesson);
        const newGrid = Array(10).fill(null).map(() => Array(6).fill(''));
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
    const handleCellChange = (row, col, value) => {
        const newGrid = [...grid];
        newGrid[row][col] = value;
        setGrid(newGrid);
        setSelectedCell({ row, col });
    };
    const checkAnswer = () => {
        if (!activeLesson)
            return;
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
        }
        else {
            alert(`❌ Not quite. Try again! Hint: ${activeLesson.explanation}`);
        }
    };
    const resetLesson = () => {
        if (activeLesson) {
            startLesson(activeLesson);
        }
    };
    const getCellStyle = (row, col) => {
        if (!activeLesson)
            return 'bg-white';
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
    const getChartData = () => {
        const data = [];
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
    const sortData = (order) => {
        const newGrid = [...grid];
        const dataRows = [];
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
    const getFilteredRows = () => {
        if (!filterValue)
            return grid;
        const threshold = parseFloat(filterValue);
        if (isNaN(threshold))
            return grid;
        const newGrid = [...grid];
        return newGrid.map((row, idx) => {
            if (idx === 0)
                return row;
            const value = parseFloat(row[1]);
            if (!isNaN(value) && value > threshold)
                return row;
            return Array(6).fill('');
        });
    };
    const categoryIcons = {
        basics: Calculator,
        references: BookOpen,
        charts: BarChart3,
        sorting: ArrowUpDown,
        filtering: Filter
    };
    const categories = [
        { id: 'basics', name: 'Basic Functions', color: 'indigo' },
        { id: 'references', name: 'Cell References', color: 'purple' },
        { id: 'charts', name: 'Charts & Graphs', color: 'green' },
        { id: 'sorting', name: 'Sorting', color: 'orange' },
        { id: 'filtering', name: 'Filtering', color: 'pink' }
    ];
    return (_jsx("div", { className: "  max-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-2xl p-6 md:p-8 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(BookOpen, { className: "w-8 md:w-10 h-8 md:h-10 text-indigo-600" }), _jsx("h1", { className: "text-2xl md:text-4xl font-bold text-gray-800", children: "SEFWI -BEKWAI SENIOR HIGH SCHOOL - SPREADSHEET PRACTICE" })] }), _jsx("p", { className: "text-gray-600 text-base md:text-lg", children: "Master spreadsheet formulas, charts, and data management for your exams!" }), _jsxs("div", { className: "mt-4 flex flex-row gap-4 text-sm justify-center ", children: [_jsx("div", { className: "bg-indigo-100 px-4 py-2 rounded-lg", children: _jsxs("span", { className: "font-semibold text-indigo-800 card", children: ["Score: ", score, "/", attempts] }) }), _jsx("div", { className: "bg-purple-100 px-4 py-2 rounded-lg", children: _jsxs("span", { className: "font-semibold text-purple-800 card", children: ["Lessons Completed: ", score] }) })] })] }), !activeLesson ? (_jsx("div", { children: categories.map((category) => {
                        const categoryLessons = lessons.filter(l => l.category === category.id);
                        if (categoryLessons.length === 0)
                            return null;
                        const Icon = categoryIcons[category.id];
                        return (_jsxs("div", { className: "m-10", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4 card", children: [_jsx(Icon, { className: "w-6 h-6 text-gray-700" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 ", children: category.name })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: categoryLessons.map((lesson) => (_jsxs("div", { className: `card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border-l-4 border-${category.color}-500`, onClick: () => startLesson(lesson), children: [_jsxs("div", { className: "flex items-start gap-3 mb-3", children: [_jsx(Icon, { className: `w-6 h-6 text-${category.color}-600 flex-shrink-0 mt-1` }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-2", children: lesson.title }), _jsx("p", { className: "text-gray-600 text-sm", children: lesson.description })] })] }), _jsxs("div", { className: `mt-4 flex items-center text-${category.color}-600 font-semibold`, children: [_jsx("span", { children: "Start Lesson" }), _jsx(ArrowRight, { className: "w-4 h-4 ml-2" })] })] }, lesson.id))) })] }, category.id));
                    }) })) : (_jsxs("div", { className: "grid lg:grid-cols-3 gap-8 card", children: [_jsxs("div", { className: "lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl md:text-2xl font-bold text-gray-800 mb-2", children: activeLesson.title }), _jsx("div", { className: "bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-4", children: _jsx("p", { className: "text-gray-700 font-semibold text-sm md:text-base", children: activeLesson.instruction }) }), _jsxs("p", { className: "text-sm text-gray-600", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Hint:" }), " ", activeLesson.explanation] })] }), activeLesson.hasSorting && (_jsxs("div", { className: "mb-4 flex gap-2", children: [_jsxs("button", { onClick: () => sortData('asc'), className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold", children: [_jsx(ArrowUpDown, { className: "w-4 h-4" }), "Sort Ascending"] }), _jsxs("button", { onClick: () => sortData('desc'), className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold", children: [_jsx(ArrowUpDown, { className: "w-4 h-4" }), "Sort Descending"] })] })), activeLesson.hasFiltering && (_jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: [_jsx(Filter, { className: "w-4 h-4 inline mr-2" }), "Filter scores greater than:"] }), _jsx("input", { type: "number", value: filterValue, onChange: (e) => setFilterValue(e.target.value), className: "border-2 border-gray-300 rounded-lg px-4 py-2 w-40", placeholder: "Enter value" })] })), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "border-collapse w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border-2 border-gray-400 bg-gray-200 p-2 w-12 text-center font-bold text-sm" }), columnLabels.map((label) => (_jsx("th", { className: "border-2 border-gray-400 bg-gray-200 p-2 w-20 md:w-24 text-center font-bold text-sm", children: label }, label)))] }) }), _jsx("tbody", { children: (activeLesson.hasFiltering ? getFilteredRows() : grid).map((row, rowIndex) => (_jsxs("tr", { children: [_jsx("td", { className: "border-2 border-gray-400 bg-gray-200 p-2 text-center font-bold text-sm", children: rowIndex + 1 }), row.map((cell, colIndex) => (_jsx("td", { className: `border-2 p-0 ${getCellStyle(rowIndex, colIndex)}`, children: _jsx("input", { type: "text", value: cell, onChange: (e) => handleCellChange(rowIndex, colIndex, e.target.value), className: "w-full h-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm", placeholder: "" }) }, colIndex)))] }, rowIndex))) })] }) }), _jsxs("div", { className: "flex flex-wrap gap-4 mt-6", children: [_jsxs("button", { onClick: checkAnswer, className: "flex items-center gap-2 bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 font-semibold shadow-lg text-sm", children: [_jsx(Check, { className: "w-4 h-4 md:w-5 md:h-5" }), activeLesson.hasChart ? 'Show Chart' : 'Check Answer'] }), _jsxs("button", { onClick: resetLesson, className: "flex items-center gap-2 bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 font-semibold shadow-lg text-sm", children: [_jsx(RotateCcw, { className: "w-4 h-4 md:w-5 md:h-5" }), "Reset"] }), _jsxs("button", { onClick: () => setActiveLesson(null), className: "flex items-center gap-2 bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-lg text-sm", children: [_jsx(X, { className: "w-4 h-4 md:w-5 md:h-5" }), "Back to Lessons"] })] }), showChart && activeLesson.hasChart && (_jsxs("div", { className: "mt-8 bg-gray-50 p-6 rounded-lg", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Data Visualization" }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-semibold mb-2", children: "Bar Chart" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: getChartData(), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "text-lg font-semibold mb-2", children: "Line Chart" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(LineChart, { data: getChartData(), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#82ca9d", strokeWidth: 2 })] }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-2", children: "Pie Chart" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: getChartData(), cx: "50%", cy: "50%", labelLine: false, label: (entry) => entry.name, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: getChartData().map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-4 md:p-6", children: [_jsx("h3", { className: "text-lg md:text-xl font-bold text-gray-800 mb-4", children: "Quick Reference" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold text-blue-900 mb-2 text-sm", children: "Basic Operators" }), _jsxs("ul", { className: "text-xs md:text-sm text-gray-700 space-y-1", children: [_jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "+" }), " Addition"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "-" }), " Subtraction"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "*" }), " Multiplication"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "/" }), " Division"] })] })] }), _jsxs("div", { className: "bg-purple-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold text-purple-900 mb-2 text-sm", children: "Cell Reference Types" }), _jsxs("ul", { className: "text-xs md:text-sm text-gray-700 space-y-2", children: [_jsxs("li", { children: [_jsx("strong", { children: "Relative:" }), " ", _jsx("code", { className: "bg-white px-1 rounded", children: "A2" }), " - Changes when copied"] }), _jsxs("li", { children: [_jsx("strong", { children: "Absolute:" }), " ", _jsx("code", { className: "bg-white px-1 rounded", children: "$A$2" }), " - Stays fixed"] }), _jsxs("li", { children: [_jsx("strong", { children: "Mixed:" }), " ", _jsx("code", { className: "bg-white px-1 rounded", children: "$A2" }), " or ", _jsx("code", { className: "bg-white px-1 rounded", children: "A$2" }), " - Locks one dimension"] })] })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold text-green-900 mb-2 text-sm", children: "Common Functions" }), _jsxs("ul", { className: "text-xs md:text-sm text-gray-700 space-y-1", children: [_jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "SUM()" }), " Add numbers"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "AVERAGE()" }), " Mean value"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "MAX()" }), " Highest value"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "MIN()" }), " Lowest value"] }), _jsxs("li", { children: [_jsx("code", { className: "bg-white px-2 py-1 rounded", children: "COUNT()" }), " Count numbers"] })] })] }), _jsxs("div", { className: "bg-orange-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold text-orange-900 mb-2 text-sm", children: "Data Management" }), _jsxs("ul", { className: "text-xs md:text-sm text-gray-700 space-y-2", children: [_jsxs("li", { children: [_jsx("strong", { children: "Sorting:" }), " Arrange data in order (ascending/descending)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Filtering:" }), " Display only matching rows"] }), _jsxs("li", { children: [_jsx("strong", { children: "Charts:" }), " Visualize data patterns"] })] })] }), _jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-bold text-yellow-900 mb-2 text-sm", children: "Tips" }), _jsxs("ul", { className: "text-xs md:text-sm text-gray-700 space-y-2", children: [_jsxs("li", { children: ["\u2713 Start formulas with ", _jsx("code", { className: "bg-white px-1 rounded", children: "=" })] }), _jsxs("li", { children: ["\u2713 Use ", _jsx("code", { className: "bg-white px-1 rounded", children: ":" }), " for ranges (A2:A5)"] }), _jsx("li", { children: "\u2713 Use $ to lock references" }), _jsx("li", { children: "\u2713 Yellow cells = answer cells" })] })] })] })] })] }))] }) }));
};
export default App;
