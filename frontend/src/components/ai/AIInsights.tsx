import { Card, Row, Col, Statistic, Tag, Progress, Alert, List, Badge } from 'antd'
import {
  RobotOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BulbOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Invoice } from '@/types'
import AIService from '@/services/aiService'

interface AIInsightsProps {
  invoices: Invoice[]
}

export default function AIInsights({ invoices }: AIInsightsProps) {
  // Calculate AI metrics
  const recentInvoices = invoices.slice(0, 10)

  // Auto-categorization rate
  const autoCategorized = recentInvoices.filter(inv => {
    const result = AIService.aiCategorizeInvoice(inv)
    return result.confidence > 85
  }).length
  const categorizationRate = Math.round((autoCategorized / recentInvoices.length) * 100)

  // Duplicate detection
  const duplicates = recentInvoices.filter(inv => {
    const result = AIService.detectDuplicate(inv, invoices)
    return result.isDuplicate
  })

  // Average OCR confidence
  const avgOCRConfidence = Math.round(
    recentInvoices.reduce((sum, inv) => sum + inv.ocrConfidence, 0) / recentInvoices.length
  )

  // Forecast next month
  const forecast = AIService.forecastNextMonthExpenses(invoices)

  // AI approval suggestions
  const needsReview = recentInvoices.filter(inv => {
    const suggestion = AIService.suggestApproval(inv, invoices)
    return !suggestion.shouldApprove
  })

  return (
    <div className="space-y-6">
      {/* AI Overview Header */}
      <Card bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Row align="middle" gutter={16}>
          <Col>
            <RobotOutlined style={{ fontSize: 48, color: 'white' }} />
          </Col>
          <Col flex={1}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              AI-Powered Invoice Intelligence
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, marginTop: '8px' }}>
              Automatic categorization, duplicate detection, and smart insights powered by AI
            </p>
          </Col>
        </Row>
      </Card>

      {/* AI Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <span>
                  <ThunderboltOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  Auto-Categorization
                </span>
              }
              value={categorizationRate}
              suffix="%"
              valueStyle={{ color: categorizationRate > 80 ? '#3f8600' : '#cf1322' }}
            />
            <Progress
              percent={categorizationRate}
              strokeColor={categorizationRate > 80 ? '#52c41a' : '#faad14'}
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <span>
                  <SafetyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                  OCR Accuracy
                </span>
              }
              value={avgOCRConfidence}
              suffix="%"
              valueStyle={{ color: avgOCRConfidence > 90 ? '#3f8600' : '#faad14' }}
            />
            <Tag color={avgOCRConfidence > 95 ? 'success' : 'warning'} style={{ marginTop: 8 }}>
              {avgOCRConfidence > 95 ? 'Excellent' : 'Good'}
            </Tag>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <span>
                  <WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  Duplicates Detected
                </span>
              }
              value={duplicates.length}
              valueStyle={{ color: duplicates.length > 0 ? '#cf1322' : '#3f8600' }}
            />
            {duplicates.length > 0 && (
              <Tag color="error" style={{ marginTop: 8 }}>
                Requires Review
              </Tag>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <span>
                  {forecast.trend === 'increasing' ? (
                    <RiseOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  ) : forecast.trend === 'decreasing' ? (
                    <FallOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  ) : (
                    <BulbOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                  )}
                  Next Month Forecast
                </span>
              }
              value={forecast.forecast}
              prefix="$"
              valueStyle={{
                color: forecast.trend === 'increasing' ? '#cf1322' :
                       forecast.trend === 'decreasing' ? '#3f8600' : '#1890ff'
              }}
            />
            <Tag
              color={
                forecast.trend === 'increasing' ? 'error' :
                forecast.trend === 'decreasing' ? 'success' : 'default'
              }
              style={{ marginTop: 8 }}
            >
              {forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)}
            </Tag>
          </Card>
        </Col>
      </Row>

      {/* AI Recommendations */}
      {needsReview.length > 0 && (
        <Card
          title={
            <span>
              <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
              AI Recommendations - {needsReview.length} items need review
            </span>
          }
          bordered={false}
        >
          <List
            dataSource={needsReview.slice(0, 5)}
            renderItem={(invoice) => {
              const suggestion = AIService.suggestApproval(invoice, invoices)
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />}
                    title={
                      <span>
                        <strong>{invoice.invoiceNumber}</strong> - {invoice.vendorName}
                        <Badge
                          count={`${suggestion.confidence}% confidence`}
                          style={{ backgroundColor: '#faad14', marginLeft: 8 }}
                        />
                      </span>
                    }
                    description={suggestion.reason}
                  />
                  <Tag color="warning">Review Required</Tag>
                </List.Item>
              )
            }}
          />
        </Card>
      )}

      {/* Smart Suggestions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                AI Auto-Categorization
              </span>
            }
            bordered={false}
          >
            <Alert
              message="Smart Category Detection"
              description={`${categorizationRate}% of invoices are automatically categorized with high confidence. Our AI learns from your patterns to improve accuracy over time.`}
              type={categorizationRate > 80 ? 'success' : 'info'}
              showIcon
              icon={<RobotOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>
                Recent auto-categorizations:
              </p>
              {recentInvoices.slice(0, 3).map(inv => {
                const cat = AIService.aiCategorizeInvoice(inv)
                return (
                  <div key={inv.id} style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>{inv.vendorName}</strong>
                    <Tag color="blue" style={{ marginLeft: 8 }}>{cat.categoryName}</Tag>
                    <Tag color="green">{cat.confidence}% confidence</Tag>
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <SafetyOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Vendor Recognition
              </span>
            }
            bordered={false}
          >
            <Alert
              message="Smart Vendor Matching"
              description="Our AI recognizes and normalizes vendor names automatically, preventing duplicate entries and ensuring data consistency."
              type="info"
              showIcon
              icon={<ThunderboltOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <p style={{ margin: 0, color: '#8c8c8c', fontSize: '12px' }}>
                Recognized vendors:
              </p>
              {recentInvoices.slice(0, 3).map(inv => {
                const vendor = AIService.recognizeVendor(inv.vendorName)
                return (
                  <div key={inv.id} style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>{inv.vendorName}</strong>
                    {vendor.isRecognized ? (
                      <Tag color="success" style={{ marginLeft: 8 }}>
                        <CheckCircleOutlined /> Recognized
                      </Tag>
                    ) : (
                      <Tag color="default" style={{ marginLeft: 8 }}>New Vendor</Tag>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
