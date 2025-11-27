import type { Prediction, Comparable, MarketTrend } from '@/types/types';

interface PDFData {
  prediction: Prediction;
  comparables: Comparable[];
  marketTrends: MarketTrend[];
}

const formatCurrency = (value: number | undefined) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number | undefined) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-IN').format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generatePDFReport = async (data: PDFData): Promise<void> => {
  const { prediction, comparables, marketTrends } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>House Price Prediction Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1e3a8a;
      background: white;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .section {
      margin-bottom: 30px;
      background: #f8fafc;
      padding: 25px;
      border-radius: 10px;
      border-left: 4px solid #f59e0b;
    }
    
    .section h2 {
      color: #1e3a8a;
      font-size: 24px;
      margin-bottom: 20px;
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 10px;
    }
    
    .price-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .price-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .price-card.highlight {
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: white;
    }
    
    .price-card h3 {
      font-size: 14px;
      margin-bottom: 10px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .price-card .amount {
      font-size: 24px;
      font-weight: bold;
    }
    
    .price-card .confidence {
      font-size: 12px;
      margin-top: 5px;
      opacity: 0.9;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .detail-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    
    .detail-item label {
      display: block;
      font-size: 12px;
      color: #64748b;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .detail-item value {
      display: block;
      font-size: 16px;
      font-weight: 600;
      color: #1e3a8a;
    }
    
    .amenities {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    
    .amenity-tag {
      background: #dbeafe;
      color: #1e3a8a;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    th {
      background: #1e3a8a;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover {
      background: #f8fafc;
    }
    
    .recommendation {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #10b981;
      margin-top: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .recommendation h3 {
      color: #10b981;
      margin-bottom: 10px;
      font-size: 18px;
    }
    
    .recommendation p {
      color: #475569;
      line-height: 1.8;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    
    .chart-placeholder {
      background: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      color: #64748b;
      margin-top: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 House Price Prediction Report</h1>
    <p>Generated on ${formatDate(new Date().toISOString())}</p>
  </div>

  <div class="section">
    <h2>📊 Price Prediction Summary</h2>
    <div class="price-grid">
      <div class="price-card">
        <h3>Minimum Price</h3>
        <div class="amount">${formatCurrency(prediction.predicted_min_price)}</div>
      </div>
      <div class="price-card">
        <h3>Average Price</h3>
        <div class="amount">${formatCurrency(prediction.predicted_avg_price)}</div>
      </div>
      <div class="price-card">
        <h3>Maximum Price</h3>
        <div class="amount">${formatCurrency(prediction.predicted_max_price)}</div>
      </div>
      <div class="price-card highlight">
        <h3>Fair Value</h3>
        <div class="amount">${formatCurrency(prediction.predicted_fair_value)}</div>
        <div class="confidence">Confidence: ${prediction.confidence_score}%</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🏡 Property Details</h2>
    <div class="details-grid">
      <div class="detail-item">
        <label>Location</label>
        <value>${prediction.locality}, ${prediction.city}</value>
      </div>
      <div class="detail-item">
        <label>Configuration</label>
        <value>${prediction.bhk} BHK</value>
      </div>
      <div class="detail-item">
        <label>Total Area</label>
        <value>${formatNumber(prediction.total_area)} sqft</value>
      </div>
      <div class="detail-item">
        <label>Price per sqft</label>
        <value>${formatCurrency(prediction.price_per_sqft)}</value>
      </div>
      <div class="detail-item">
        <label>Bathrooms</label>
        <value>${prediction.bathrooms}</value>
      </div>
      <div class="detail-item">
        <label>Furnishing</label>
        <value>${prediction.furnishing_status}</value>
      </div>
      <div class="detail-item">
        <label>Property Age</label>
        <value>${prediction.property_age || 'N/A'} years</value>
      </div>
      <div class="detail-item">
        <label>Floor</label>
        <value>${prediction.floor_number || 'N/A'}${prediction.total_floors ? ` of ${prediction.total_floors}` : ''}</value>
      </div>
      <div class="detail-item">
        <label>Facing</label>
        <value>${prediction.facing_direction || 'N/A'}</value>
      </div>
    </div>
    
    <div style="margin-top: 20px;">
      <label style="display: block; font-size: 14px; color: #64748b; margin-bottom: 10px; font-weight: 600;">AMENITIES</label>
      <div class="amenities">
        ${prediction.parking ? '<span class="amenity-tag">🅿️ Parking</span>' : ''}
        ${prediction.has_lift ? '<span class="amenity-tag">🛗 Lift</span>' : ''}
        ${prediction.has_security ? '<span class="amenity-tag">🔒 Security</span>' : ''}
        ${prediction.has_power_backup ? '<span class="amenity-tag">⚡ Power Backup</span>' : ''}
        ${!prediction.parking && !prediction.has_lift && !prediction.has_security && !prediction.has_power_backup ? '<span style="color: #64748b;">No additional amenities</span>' : ''}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>💡 Investment Recommendation</h2>
    <div class="recommendation">
      <h3>Analysis</h3>
      <p>
        Based on comprehensive market analysis and property features, this ${prediction.bhk} BHK property 
        in ${prediction.locality}, ${prediction.city} is valued at <strong>${formatCurrency(prediction.predicted_fair_value)}</strong>.
      </p>
      <p style="margin-top: 15px;">
        The confidence score of <strong>${prediction.confidence_score}%</strong> indicates a reliable prediction 
        based on current market trends and comparable properties in the area.
      </p>
      <p style="margin-top: 15px;">
        The price per square foot of <strong>${formatCurrency(prediction.price_per_sqft)}</strong> is 
        competitive for the ${prediction.locality} area, making this a potentially good investment opportunity.
      </p>
    </div>
  </div>

  ${comparables.length > 0 ? `
  <div class="section">
    <h2>🔍 Comparable Properties</h2>
    <p style="color: #64748b; margin-bottom: 15px;">Similar properties in ${prediction.city} for comparison</p>
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>BHK</th>
          <th>Area (sqft)</th>
          <th>Furnishing</th>
          <th>Price</th>
          <th>Price/sqft</th>
        </tr>
      </thead>
      <tbody>
        ${comparables.map(comp => `
          <tr>
            <td><strong>${comp.locality}</strong></td>
            <td>${comp.bhk} BHK</td>
            <td>${formatNumber(comp.total_area)}</td>
            <td>${comp.furnishing_status || 'N/A'}</td>
            <td><strong>${formatCurrency(comp.price)}</strong></td>
            <td>${formatCurrency(comp.price_per_sqft)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${marketTrends.length > 0 ? `
  <div class="section">
    <h2>📈 Market Trends</h2>
    <p style="color: #64748b; margin-bottom: 15px;">Historical price trends for ${prediction.city}</p>
    <table>
      <thead>
        <tr>
          <th>Period</th>
          <th>Average Price</th>
          <th>Price per sqft</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        ${marketTrends.slice(0, 6).map(trend => `
          <tr>
            <td><strong>${trend.month} ${trend.year}</strong></td>
            <td>${formatCurrency(trend.avg_price)}</td>
            <td>${formatCurrency(trend.avg_price_per_sqft)}</td>
            <td>${trend.total_transactions || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="chart-placeholder">
      <p>📊 Market trend visualization available in the online platform</p>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>House Price Prediction Platform</strong></p>
    <p>This report is generated using advanced machine learning algorithms and current market data.</p>
    <p style="margin-top: 10px;">For more information, visit our platform or contact support.</p>
    <p style="margin-top: 10px; font-size: 12px;">Report ID: ${prediction.id}</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url);
      }, 250);
    };
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = `house-price-report-${prediction.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
