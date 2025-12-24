import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PolicyIcon from '@mui/icons-material/Policy';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import BugReportIcon from '@mui/icons-material/BugReport';
import DescriptionIcon from '@mui/icons-material/Description';

export const SecurityPage: React.FC = () => {
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
            <Box mb={3}>
              <ShieldIcon sx={{ fontSize: 80, opacity: 0.9 }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
              }}
            >
              Security-First Architecture
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', md: '1.3rem' },
                mb: 4,
                opacity: 0.95,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Enterprise-grade security isn't optional—it's the foundation.
              Every line of code, every deployment, every feature is designed with
              zero-trust principles and compliance automation.
            </Typography>

            <Button
              variant="contained"
              size="large"
              href="https://groundworkjs.com/security-audit?xref=tenant-demo-security"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<DescriptionIcon />}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              View Full Security Audit
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Compliance Badges */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Industry-Standard Compliance
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: 'FedRAMP Ready',
                icon: <AssuredWorkloadIcon sx={{ fontSize: 50, color: '#667eea' }} />,
                description:
                  'Meets Federal Risk and Authorization Management Program standards for cloud security.',
              },
              {
                name: 'HIPAA Compliant',
                icon: <PolicyIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
                description:
                  'Full compliance with Health Insurance Portability and Accountability Act for PHI protection.',
              },
              {
                name: 'PCI DSS',
                icon: <GppGoodIcon sx={{ fontSize: 50, color: '#f093fb' }} />,
                description:
                  'Payment Card Industry Data Security Standard certified for handling payment data.',
              },
              {
                name: 'OWASP Top 10',
                icon: <BugReportIcon sx={{ fontSize: 50, color: '#43e97b' }} />,
                description:
                  'Comprehensive protection against all OWASP Top 10 vulnerabilities and attack vectors.',
              },
            ].map((compliance) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={compliance.name}>
                <Card
                  sx={{
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-8px)' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box mb={2}>{compliance.icon}</Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {compliance.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {compliance.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Security Architecture */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
          Multi-Layer Security Architecture
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              layer: 'Authentication Layer',
              icon: <LockIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              features: [
                'OAuth2/OpenID Connect integration',
                'JWT with automatic rotation',
                'Multi-factor authentication (MFA)',
                'Secure session management',
                'Account lockout after failed attempts',
                'Passwordless authentication support',
              ],
            },
            {
              layer: 'Authorization Layer',
              icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
              features: [
                'Role-Based Access Control (RBAC)',
                'Attribute-Based Access Control (ABAC)',
                'Resource-level permissions',
                'Dynamic permission evaluation',
                'Tenant-scoped authorization',
                'API key management',
              ],
            },
            {
              layer: 'Data Protection Layer',
              icon: <ShieldIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
              features: [
                'TLS 1.3 encryption in transit',
                'AES-256 encryption at rest',
                'Database-level encryption',
                'Encrypted backups with rotation',
                'Secure key management (KMS)',
                'Data masking for sensitive fields',
              ],
            },
            {
              layer: 'Audit & Monitoring',
              icon: <SecurityIcon sx={{ fontSize: 40, color: '#43e97b' }} />,
              features: [
                'Comprehensive audit logging',
                'Real-time security event monitoring',
                'Automated threat detection',
                'Compliance report generation',
                'Tamper-proof log storage',
                'Security information and event management (SIEM)',
              ],
            },
          ].map((layer) => (
            <Grid size={{ xs: 12, md: 6 }} key={layer.layer}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                  {layer.icon}
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {layer.layer}
                  </Typography>
                </Stack>

                <List>
                  {layer.features.map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: '#43e97b' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Tenant Isolation */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 2 }}>
            Complete Tenant Isolation
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
          >
            Every tenant runs in a hardened sandbox. Zero shared resources, zero cross-tenant access, zero compromise.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Container Isolation',
                description:
                  'Each tenant runs in a dedicated isolated environment with strict resource limits, network segmentation, and hardened security policies.',
                points: [
                  'Dedicated environment per tenant',
                  'CPU and memory limits enforced',
                  'Complete network segmentation',
                  'Hardened security boundaries',
                ],
              },
              {
                title: 'Database Isolation',
                description:
                  'Complete logical separation with multi-layer security policies and dedicated resource allocation per tenant.',
                points: [
                  'Dedicated database space per tenant',
                  'Multi-layer security policies',
                  'Isolated connection management',
                  'Query-level validation and filtering',
                ],
              },
              {
                title: 'Cache Isolation',
                description:
                  'Strict cache separation prevents data pollution. Each tenant has dedicated cache space and memory quotas.',
                points: [
                  'Isolated cache per tenant',
                  'Memory quota enforcement',
                  'Automatic eviction policies',
                  'Independent cache management',
                ],
              },
              {
                title: 'File System Isolation',
                description:
                  'Uploaded files stored with tenant-specific prefixes. Access control lists (ACLs) prevent cross-tenant file access.',
                points: [
                  'Tenant-prefixed file paths',
                  'Separate storage buckets',
                  'Pre-signed URL access only',
                  'Automatic virus scanning',
                ],
              },
            ].map((isolation) => (
              <Grid size={{ xs: 12, md: 6 }} key={isolation.title}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {isolation.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {isolation.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <List dense>
                      {isolation.points.map((point) => (
                        <ListItem key={point} disableGutters>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={point}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Vulnerability Protection */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
          OWASP Top 10 Protection
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              threat: 'SQL Injection',
              protection:
                'Advanced query protection, validation mechanisms, and type-safe operations prevent all SQL injection attacks.',
            },
            {
              threat: 'Broken Authentication',
              protection:
                'OAuth2/OIDC, automatic token rotation, MFA support, session management, and account lockout policies.',
            },
            {
              threat: 'Sensitive Data Exposure',
              protection:
                'TLS 1.3, AES-256 encryption, secure key management, encrypted backups, and data masking.',
            },
            {
              threat: 'XML External Entities (XXE)',
              protection:
                'Secure data parsing with strict validation. Modern API design prevents legacy vulnerability vectors.',
            },
            {
              threat: 'Broken Access Control',
              protection:
                'RBAC, ABAC, resource-level permissions, tenant-scoped authorization, and row-level security.',
            },
            {
              threat: 'Security Misconfiguration',
              protection:
                'Secure defaults, automated hardening scripts, CIS benchmarks, and configuration validation.',
            },
            {
              threat: 'Cross-Site Scripting (XSS)',
              protection:
                'React auto-escaping, Content Security Policy (CSP), sanitization libraries, and input validation.',
            },
            {
              threat: 'Insecure Deserialization',
              protection:
                'Type-safe serialization, strict validation, and secure data handling prevent deserialization attacks.',
            },
            {
              threat: 'Using Components with Known Vulnerabilities',
              protection:
                'Automated dependency scanning, security patches, and version pinning with automated updates.',
            },
            {
              threat: 'Insufficient Logging & Monitoring',
              protection:
                'Comprehensive audit logging, real-time monitoring, SIEM integration, and automated alerting.',
            },
          ].map((item, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={item.threat}>
              <Paper sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Chip
                    label={`#${idx + 1}`}
                    sx={{
                      bgcolor: '#667eea',
                      color: 'white',
                      fontWeight: 600,
                      minWidth: 40,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {item.threat}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.protection}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Security Resources */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
            Security Documentation
          </Typography>

          <Stack spacing={3}>
            {[
              {
                title: 'Complete Security Audit (Technical)',
                description:
                  'Deep-dive technical analysis of authentication, authorization, audit logging, SQL injection prevention, and tenant isolation.',
                href: 'https://groundworkjs.com/docs/security-audit-technical?xref=tenant-demo-security',
              },
              {
                title: 'Security Audit (Executive Summary)',
                description:
                  'Business-focused overview highlighting compliance, risk mitigation, and ROI of security investments.',
                href: 'https://groundworkjs.com/docs/security-audit-marketing?xref=tenant-demo-security',
              },
              {
                title: 'Infrastructure Security Audit',
                description:
                  'Analysis of infrastructure provisioning, security hardening, container security, and automated deployment safeguards.',
                href: 'https://groundworkjs.com/docs/infrastructure-security?xref=tenant-demo-security',
              },
              {
                title: 'Compliance Implementation Guide',
                description:
                  'Step-by-step guide for achieving FedRAMP, HIPAA, PCI DSS, and SOC 2 compliance with GroundWorkJS.',
                href: 'https://groundworkjs.com/docs/compliance-guide?xref=tenant-demo-security',
              },
            ].map((doc) => (
              <Card key={doc.title}>
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {doc.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<DescriptionIcon />}
                    >
                      View
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Security Built In. Compliance Automated.
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Stop retrofitting security. Start with a platform designed for zero-trust from day one.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="https://groundworkjs.com/start?xref=tenant-demo-security-bottom"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 5,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
            mt: 2,
          }}
        >
          Get Started Securely
        </Button>
      </Container>
    </Box>
  );
};

export default SecurityPage;
