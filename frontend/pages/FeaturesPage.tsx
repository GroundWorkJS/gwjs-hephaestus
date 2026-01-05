import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SpeedIcon from '@mui/icons-material/Speed';
import ExtensionIcon from '@mui/icons-material/Extension';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LockIcon from '@mui/icons-material/Lock';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const FeaturesPage: React.FC = () => {
  const featureCategories = [
    {
      title: 'Security & Compliance',
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      features: [
        {
          name: 'Zero-Trust Authentication',
          description:
            'Multi-layer OAuth2/OIDC with JWT validation, automatic token rotation, and session management. Every request is authenticated and authorized.',
        },
        {
          name: 'Tenant Isolation',
          description:
            'Complete sandbox isolation per tenant. Separate containers, dedicated database instances, and isolated caching layers prevent any cross-tenant data leakage.',
        },
        {
          name: 'Automatic Audit Logging',
          description:
            'Comprehensive audit trails track every database query, API call, authentication event, and user action. Tamper-proof logs for compliance.',
        },
        {
          name: 'SQL Injection Prevention',
          description:
            'Advanced query protection and validation mechanisms prevent all SQL injection attacks. Type-safe database operations guaranteed by design.',
        },
        {
          name: 'Compliance Frameworks',
          description:
            'Pre-configured controls for FedRAMP, HIPAA, PCI DSS, and SOC 2. Automated compliance reporting and continuous monitoring.',
        },
        {
          name: 'Data Encryption',
          description:
            'TLS 1.3 in transit, AES-256 at rest. Encrypted backups, secure key management, and automatic certificate rotation.',
        },
      ],
    },
    {
      title: 'Infrastructure & DevOps',
      icon: <CloudQueueIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
      features: [
        {
          name: 'One-Command Deployment',
          description:
            'Single script provisions: VPS instance, PostgreSQL cluster, Redis cache, SSL certificates, monitoring, and CI/CD pipelines.',
        },
        {
          name: 'Automated Security Hardening',
          description:
            'Firewall rules, intrusion prevention, malware scanning, automatic security patches, and industry benchmark compliance configured automatically.',
        },
        {
          name: 'High Availability',
          description:
            'Load balancing, automatic failover, database replication, and Redis clustering. 99.99% uptime SLA guaranteed.',
        },
        {
          name: 'CI/CD Pipelines',
          description:
            'GitHub Actions workflows for testing, building, and deploying. Automated rollbacks, blue-green deployments, and canary releases.',
        },
        {
          name: 'Infrastructure as Code',
          description:
            'Version-controlled infrastructure definitions. Reproducible environments across dev, staging, and production.',
        },
        {
          name: 'Container Orchestration',
          description:
            'Docker-based isolation with resource limits, health checks, automatic restarts, and zero-downtime updates.',
        },
      ],
    },
    {
      title: 'Developer Experience',
      icon: <CodeIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
      features: [
        {
          name: 'Modern Development Tools',
          description:
            'Comprehensive development environment with hot module replacement, instant feedback, and optimized build pipelines for rapid iteration.',
        },
        {
          name: 'Type-Safe APIs',
          description:
            'Full TypeScript support with automatic type generation, ensuring compile-time safety and excellent IDE integration throughout your codebase.',
        },
        {
          name: 'GraphQL API',
          description:
            'Type-safe GraphQL API with automatic optimization, intelligent caching, and streamlined data fetching.',
        },
        {
          name: 'Modern Tech Stack',
          description:
            'Latest React framework, TypeScript, modern ORM, robust API layer, enterprise database, and high-performance caching. Production-ready patterns included.',
        },
        {
          name: 'Development Environment',
          description:
            'Pre-configured IDE workspace, debugging tools, code quality standards, automatic formatting, and version control hooks.',
        },
        {
          name: 'Comprehensive Documentation',
          description:
            'Interactive API docs, architecture guides, security best practices, and runbooks. Example code for every feature.',
        },
      ],
    },
    {
      title: 'Customization & Extensibility',
      icon: <ExtensionIcon sx={{ fontSize: 40, color: '#4facfe' }} />,
      features: [
        {
          name: 'Custom Branding',
          description:
            'Full white-label capabilities including custom logos, color schemes, themes, and branding elements. Make it truly yours.',
        },
        {
          name: 'Workflow Customization',
          description:
            'Configure and customize business workflows, approval processes, and automation rules to match your organization\'s unique requirements.',
        },
        {
          name: 'API Integration',
          description:
            'RESTful and GraphQL APIs for seamless integration with your existing tools and services. Webhooks for real-time event notifications.',
        },
        {
          name: 'Custom Features',
          description:
            'Extend the platform with custom features and functionality tailored to your business needs. Future plugin system on roadmap.',
        },
        {
          name: 'Multi-Tenant Architecture',
          description:
            'Deploy multiple isolated instances from a single platform. Each tenant gets dedicated resources while sharing infrastructure efficiency.',
        },
        {
          name: 'Configuration Management',
          description:
            'Centralized configuration for all platform settings. Environment-specific configs with validation and version control.',
        },
      ],
    },
    {
      title: 'Monitoring & Operations',
      icon: <MonitorHeartIcon sx={{ fontSize: 40, color: '#43e97b' }} />,
      features: [
        {
          name: 'Real-Time Dashboards',
          description:
            'Comprehensive dashboards for system metrics, application performance, security events, and business analytics.',
        },
        {
          name: 'Alerting & Notifications',
          description:
            'Automated alerts for security incidents, performance degradation, and infrastructure issues. Slack, email, and PagerDuty integration.',
        },
        {
          name: 'Log Aggregation',
          description:
            'Centralized logging with structured format, full-text search, and automatic retention policies.',
        },
        {
          name: 'Performance Profiling',
          description:
            'Application Performance Monitoring (APM) tracks slow queries, API latency, and resource bottlenecks.',
        },
        {
          name: 'Automated Backups',
          description:
            'Encrypted backups every 6 hours with point-in-time recovery. Automatic backup testing and restoration drills.',
        },
        {
          name: 'Health Checks',
          description:
            'Continuous health monitoring for databases, caches, APIs, and external dependencies. Automatic remediation.',
        },
      ],
    },
    {
      title: 'Data & Analytics',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#fa709a' }} />,
      features: [
        {
          name: 'Enterprise Database',
          description:
            'Latest PostgreSQL with JSON support, full-text search, advanced extensions, and optimized query planning.',
        },
        {
          name: 'Redis Caching',
          description:
            'High-performance caching layer with automatic invalidation, session storage, and pub/sub messaging.',
        },
        {
          name: 'Database Migrations',
          description:
            'Version-controlled database changes with rollback support. Automated testing prevents production failures.',
        },
        {
          name: 'Query Optimization',
          description:
            'Automatic query analysis, index recommendations, and slow query detection. Performance insights dashboard.',
        },
        {
          name: 'Data Isolation',
          description:
            'Multi-layer security policies enforce strict tenant boundaries. Zero shared data, complete logical separation guaranteed.',
        },
        {
          name: 'Scalability',
          description:
            'Horizontal scaling with intelligent load distribution, optimized connections, and automatic partitioning for high-growth workloads.',
        },
      ],
    },
  ];

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
              Enterprise Features. Zero Configuration.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', md: '1.3rem' },
                mb: 3,
                opacity: 0.95,
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Every feature your enterprise needs, pre-configured and production-ready.
              No setup. No maintenance. Just ship.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ gap: 1 }}
            >
              <Chip
                label="40+ Enterprise Features"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label="Zero Setup Time"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label="100% Compliant"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Feature Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {featureCategories.map((category, idx) => (
          <Box key={category.title} mb={6}>
            {/* Category Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              {category.icon}
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {category.title}
              </Typography>
            </Box>

            {/* Features Grid */}
            <Grid container spacing={3}>
              {category.features.map((feature) => (
                <Grid size={{ xs: 12, md: 6 }} key={feature.name}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <CheckCircleIcon sx={{ color: '#43e97b', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {feature.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Frequently Asked Questions
          </Typography>

          {[
            {
              q: 'Do I need to configure security settings?',
              a: 'No. Every instance comes with enterprise-grade security pre-configured: TLS encryption, authentication, audit logging, and compliance controls are enabled by default.',
            },
            {
              q: 'Can I customize the platform for my organization?',
              a: 'Absolutely. The platform is designed for deep customization including branding, workflows, integrations, and custom features. You maintain full control while benefiting from security and compliance built into the foundation.',
            },
            {
              q: 'What features are planned for the future?',
              a: 'Our roadmap includes advanced analytics, AI-powered insights, mobile apps, expanded integration marketplace, and a comprehensive plugin ecosystem. We regularly update based on customer feedback.',
            },
            {
              q: 'How does plugin sandboxing work?',
              a: 'While our plugin system is on the roadmap, it will feature isolated execution environments with restricted access to system resources and tenant data. Resource limits will prevent abuse, with comprehensive audit logging.',
            },
            {
              q: 'What happens during updates?',
              a: 'Zero-downtime rolling updates. The platform automatically tests updates in staging, deploys with blue-green strategy, and rolls back if health checks fail.',
            },
            {
              q: 'Who owns the platform and data?',
              a: 'You maintain complete ownership of your data and instance. The platform provides the infrastructure and features as a subscription service with full data portability.',
            },
          ].map(({ q, a }) => (
            <Accordion key={q}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>{q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Tech Stack */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mb: 6 }}>
          Modern, Production-Ready Stack
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              category: 'Frontend',
              icon: <CodeIcon sx={{ fontSize: 35 }} />,
              tech: ['React Framework', 'TypeScript', 'Material Design', 'GraphQL', 'SSR'],
            },
            {
              category: 'Backend',
              icon: <StorageIcon sx={{ fontSize: 35 }} />,
              tech: ['Node.js', 'Modern ORM', 'GraphQL', 'OAuth2', 'Real-time APIs'],
            },
            {
              category: 'Data',
              icon: <CloudQueueIcon sx={{ fontSize: 35 }} />,
              tech: ['PostgreSQL', 'Redis Cache', 'Log Aggregation', 'Metrics', 'Monitoring'],
            },
            {
              category: 'Infrastructure',
              icon: <AutorenewIcon sx={{ fontSize: 35 }} />,
              tech: ['Containers', 'Cloud VPS', 'CI/CD Pipelines', 'SSL/TLS', 'Firewalls'],
            },
          ].map(({ category, icon, tech }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Box mb={2}>{icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
                <List dense>
                  {tech.map((item) => (
                    <ListItem key={item} sx={{ justifyContent: 'center', py: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesPage;
