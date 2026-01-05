import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';

export const PricingPage: React.FC = () => {
  // ROI Calculator State
  const [developers, setDevelopers] = useState(3);
  const [avgSalary, setAvgSalary] = useState(120000);
  const [devTimeOnInfra, setDevTimeOnInfra] = useState(20);
  const [showAnnual, setShowAnnual] = useState(true);

  // ROI Calculations
  const devTimeWasted = (developers * (avgSalary / 2080) * (devTimeOnInfra / 100) * 40) * 52;
  const cloudSavings = 12000; // Average savings vs DIY cloud
  const complianceSavings = 50000; // Average compliance setup cost
  const annualSavings = devTimeWasted + cloudSavings + complianceSavings;
  const monthlyBasePrice = 249;
  const annualBasePrice = monthlyBasePrice * 12 * 0.85; // 15% discount
  const roi = ((annualSavings - annualBasePrice) / annualBasePrice) * 100;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', md: '1.3rem' },
                mb: 4,
                opacity: 0.95,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Everything you need in one predictable subscription.
              Scale resources as you grow—no hidden fees, no surprises.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={showAnnual}
                  onChange={(e) => setShowAnnual(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'rgba(255,255,255,0.5)',
                    },
                  }}
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Monthly</Typography>
                  <Chip
                    label="Save 15%"
                    size="small"
                    sx={{
                      bgcolor: '#43e97b',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Typography sx={{ fontWeight: showAnnual ? 700 : 400 }}>
                    Annual
                  </Typography>
                </Stack>
              }
              sx={{ color: 'white' }}
            />
          </Box>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* Standard Plan */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <CardContent sx={{ p: 4, flex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Standard
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Perfect for small businesses and startups
                </Typography>

                <Box my={3}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    ${showAnnual ? '212' : '249'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per instance/month{showAnnual && ' (billed annually)'}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  href={`https://groundworkjs.com/signup?plan=standard&xref=${typeof window !== 'undefined' ? window.location.hostname : 'tenant-demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mb: 3 }}
                >
                  Get Started
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Included resources:
                </Typography>

                <List dense>
                  {[
                    '2 vCPUs, 4GB RAM',
                    '50GB SSD storage',
                    '500GB bandwidth/month',
                    'Dedicated database instance',
                    'SSL certificates included',
                    'Daily automated backups',
                    'Email & chat support',
                    'All security features',
                    '99.9% uptime SLA',
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#43e97b' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Usage-based pricing:
                </Typography>
                <List dense>
                  {[
                    'Additional storage: $0.10/GB',
                    'Additional bandwidth: $0.05/GB',
                    'Extra CPU/RAM: from $50/month',
                  ].map((item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Plan */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: '3px solid #667eea',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              }}
            >
              <Chip
                icon={<StarIcon />}
                label="Most Popular"
                sx={{
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: '#667eea',
                  color: 'white',
                  fontWeight: 600,
                }}
              />

              <CardContent sx={{ p: 4, flex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Professional
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  For growing businesses and teams
                </Typography>

                <Box my={3}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    ${showAnnual ? '424' : '499'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per instance/month{showAnnual && ' (billed annually)'}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  href={`https://groundworkjs.com/signup?plan=professional&xref=${typeof window !== 'undefined' ? window.location.hostname : 'tenant-demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Get Started
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Everything in Standard, plus:
                </Typography>

                <List dense>
                  {[
                    '4 vCPUs, 8GB RAM',
                    '200GB SSD storage',
                    '2TB bandwidth/month',
                    'Dedicated Redis cache',
                    'Priority support (24/7)',
                    'Advanced monitoring',
                    'Custom domain support',
                    '99.95% uptime SLA',
                    'Compliance reporting',
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Usage-based pricing:
                </Typography>
                <List dense>
                  {[
                    'Additional storage: $0.08/GB',
                    'Additional bandwidth: $0.04/GB',
                    'Extra CPU/RAM: from $40/month',
                  ].map((item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Enterprise Plan */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <CardContent sx={{ p: 4, flex: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Enterprise
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  For organizations with compliance needs
                </Typography>

                <Box my={3}>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    Custom
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact sales for pricing
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  href={`https://groundworkjs.com/contact?plan=enterprise&xref=${typeof window !== 'undefined' ? window.location.hostname : 'tenant-demo'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mb: 3 }}
                >
                  Contact Sales
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Everything in Professional, plus:
                </Typography>

                <List dense>
                  {[
                    'Custom CPU, RAM, storage',
                    'Unlimited bandwidth',
                    'Dedicated infrastructure',
                    'On-premise deployment option',
                    'White-label capabilities',
                    'Custom SLA (up to 99.99%)',
                    'Dedicated account manager',
                    'Government certifications',
                    'Custom integrations',
                    'Training & onboarding',
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#764ba2' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Custom pricing based on:
                </Typography>
                <List dense>
                  {[
                    'Number of instances',
                    'Resource requirements',
                    'Support level',
                    'Compliance needs',
                  ].map((item) => (
                    <ListItem key={item} disableGutters>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ROI Calculator */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <TrendingUpIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              ROI Calculator
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See how much you'll save by not building infrastructure
            </Typography>
          </Box>

          <Paper sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography gutterBottom>Number of Developers</Typography>
                <Slider
                  value={developers}
                  onChange={(_, val) => setDevelopers(val as number)}
                  min={1}
                  max={20}
                  marks
                  valueLabelDisplay="on"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography gutterBottom>Average Developer Salary ($)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography gutterBottom>
                  % of Dev Time Spent on Infrastructure ({devTimeOnInfra}%)
                </Typography>
                <Slider
                  value={devTimeOnInfra}
                  onChange={(_, val) => setDevTimeOnInfra(val as number)}
                  min={5}
                  max={50}
                  marks={[
                    { value: 5, label: '5%' },
                    { value: 20, label: '20%' },
                    { value: 50, label: '50%' },
                  ]}
                  valueLabelDisplay="on"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Results */}
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Annual Cost Analysis
              </Typography>

              <Stack spacing={2} mt={3}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Developer time saved</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#43e97b' }}>
                    ${devTimeWasted.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Cloud infrastructure savings</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#43e97b' }}>
                    ${cloudSavings.toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Compliance setup avoided</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#43e97b' }}>
                    ${complianceSavings.toLocaleString()}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 700 }}>Total Annual Savings</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#43e97b' }}>
                    ${annualSavings.toLocaleString()}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography>Platform subscription (Annual)</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    -${annualBasePrice.toLocaleString()}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Net Savings (Year 1)
                  </Typography>
                  <Chip
                    icon={<SavingsIcon />}
                    label={`$${(annualSavings - annualBasePrice).toLocaleString()}`}
                    sx={{
                      bgcolor: '#43e97b',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 2,
                      py: 3,
                    }}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Return on Investment
                  </Typography>
                  <Chip
                    label={`${Math.round(roi)}% ROI`}
                    sx={{
                      bgcolor: '#667eea',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 2,
                      py: 3,
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Feature Comparison */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
          Detailed Feature Comparison
        </Typography>

        <Paper sx={{ overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '16px', textAlign: 'left', minWidth: '200px' }}>
                    Feature
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', minWidth: '120px' }}>
                    Standard
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', minWidth: '120px' }}>
                    Professional
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', minWidth: '120px' }}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Multi-tenant architecture', standard: true, pro: true, ent: true },
                  { feature: 'Dedicated database instance', standard: true, pro: true, ent: true },
                  { feature: 'SSL certificates', standard: true, pro: true, ent: true },
                  { feature: 'All security features', standard: true, pro: true, ent: true },
                  { feature: 'Automated backups', standard: true, pro: true, ent: true },
                  { feature: 'Email & chat support', standard: true, pro: false, ent: false },
                  { feature: 'FedRAMP/HIPAA/PCI compliance', standard: false, pro: true, ent: true },
                  { feature: '24/7 priority support', standard: false, pro: true, ent: true },
                  { feature: 'Advanced monitoring', standard: false, pro: true, ent: true },
                  { feature: 'Compliance reporting', standard: false, pro: true, ent: true },
                  { feature: 'Custom domain support', standard: false, pro: true, ent: true },
                  { feature: 'White-label capabilities', standard: false, pro: false, ent: true },
                  { feature: 'On-premise deployment', standard: false, pro: false, ent: true },
                  { feature: 'Dedicated infrastructure', standard: false, pro: false, ent: true },
                  { feature: 'Custom SLA (up to 99.99%)', standard: false, pro: false, ent: true },
                  { feature: 'Dedicated account manager', standard: false, pro: false, ent: true },
                  { feature: 'Government certifications', standard: false, pro: false, ent: true },
                  { feature: 'Custom integrations', standard: false, pro: false, ent: true },
                ].map((row, idx) => (
                  <tr
                    key={row.feature}
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>{row.feature}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {row.standard ? (
                        <CheckCircleIcon sx={{ color: '#43e97b' }} />
                      ) : (
                        <CloseIcon sx={{ color: '#ccc' }} />
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {row.pro ? (
                        <CheckCircleIcon sx={{ color: '#667eea' }} />
                      ) : (
                        <CloseIcon sx={{ color: '#ccc' }} />
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {row.ent ? (
                        <CheckCircleIcon sx={{ color: '#764ba2' }} />
                      ) : (
                        <CloseIcon sx={{ color: '#ccc' }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </Container>

      {/* FAQ */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
            Pricing FAQ
          </Typography>

          <Stack spacing={3}>
            {[
              {
                q: 'Can I start with Standard and upgrade later?',
                a: 'Absolutely! Start with the Standard plan and upgrade to Professional or Enterprise anytime. Your data and settings migrate seamlessly with zero downtime.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, ACH transfers, and wire payments. Annual plans can be invoiced with NET-30 terms for qualified businesses and organizations.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Get a 14-day free trial of any plan with no credit card required. Experience full features including security, compliance, and support risk-free.',
              },
              {
                q: 'How does usage-based pricing work?',
                a: 'Each plan includes baseline resources (storage, bandwidth, compute). If you exceed these, you pay only for what you use at the rates listed. No surprise bills—we notify you before charges apply.',
              },
              {
                q: 'What if I need to cancel?',
                a: 'You can cancel anytime with no penalty. Annual plans are refundable pro-rata within the first 60 days. You maintain complete data ownership and can export at any time.',
              },
            ].map(({ q, a }) => (
              <Paper key={q} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {q}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {a}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Join organizations building secure, compliant solutions with our platform.
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            href="https://groundworkjs.com/signup?xref=tenant-demo-pricing-bottom"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://groundworkjs.com/contact?xref=tenant-demo-pricing-bottom"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 5, py: 2, fontSize: '1.1rem', fontWeight: 600 }}
          >
            Talk to Sales
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default PricingPage;
