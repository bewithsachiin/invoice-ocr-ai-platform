import { Card, Statistic, Progress } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface StatCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  icon?: React.ReactNode
  trend?: number
  loading?: boolean
  color?: string
  showProgress?: boolean
  progressPercent?: number
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  loading,
  color = '#1677ff',
  showProgress,
  progressPercent,
}: StatCardProps) {
  return (
    <Card
      loading={loading}
      className="card-hover"
      style={{ height: '100%' }}
    >
      <div className="flex items-start justify-between">
        <Statistic
          title={title}
          value={value}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{ color }}
        />
        {icon && (
          <div
            className="text-3xl p-3 rounded-lg"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-4">
          <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
            {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {' '}{Math.abs(trend)}%
          </span>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
      )}
      {showProgress && progressPercent !== undefined && (
        <div className="mt-4">
          <Progress percent={progressPercent} strokeColor={color} />
        </div>
      )}
    </Card>
  )
}
