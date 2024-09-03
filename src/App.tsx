import {
  Dot,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400, },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210, },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290, },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000, },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181, },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500, },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100, },
]

const getScoreThreshold = (key: string) => {
  const values: number[] = data.map(it => it[key])
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = values.reduce((a, b) => a + b) / n
  const standardDeviation = Math.sqrt(
    values.map(it => (it - mean) ** 2).reduce((a, b) => a + b) / n
  )
  const value = mean + standardDeviation
  const norm = (max - value) / (max - min)
  return {value, norm}
}

const CustomizedDot = (props) => {
  const {fill, stroke, threshold, value} = props
  return <Dot
    {...props}
    fill={value < threshold? fill: "#f44336"}
    stroke={value < threshold? stroke: "#f44336"}
  />
}

export default function App() {
  const scoreThresholdPV = getScoreThreshold("pv")
  const scoreThresholdUV = getScoreThreshold("uv")
  const pvBreakPointPercentage = `${scoreThresholdPV.norm * 100}%`
  const uvBreakPointPercentage = `${scoreThresholdUV.norm * 100}%`

  return (
    <LineChart width={800} height={600} data={data}>
      <defs>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f44336" />
          <stop offset={pvBreakPointPercentage} stopColor="#f44336" />
          <stop offset={pvBreakPointPercentage} stopColor="#8884d8" />
          <stop offset={"100%"} stopColor="#8884d8" />
        </linearGradient>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f44336" />
          <stop offset={uvBreakPointPercentage} stopColor="#f44336" />
          <stop offset={uvBreakPointPercentage} stopColor="#82ca9d" />
          <stop offset={"100%"} stopColor="#82ca9d" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="pv"
        stroke="url(#colorPv)"
        dot={<CustomizedDot stroke="#8884d8" threshold={scoreThresholdPV.value} />}
        activeDot={<CustomizedDot r={8} fill="#8884d8" stroke="#8884d8" threshold={scoreThresholdPV.value} />}
      />
      <Line
        type="monotone"
        dataKey="uv"
        stroke="url(#colorUv)"
        dot={<CustomizedDot stroke="#82ca9d" threshold={scoreThresholdUV.value} />}
        activeDot={<CustomizedDot r={8} fill="#82ca9d" stroke="#82ca9d" threshold={scoreThresholdUV.value} />}
      />
    </LineChart>
  )
}
