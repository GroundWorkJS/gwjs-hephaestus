'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
} from '@groundworkjs/plugin-sdk/ui';

interface Taco {
  id: string;
  name: string;
  description: string;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extreme';
  price: number;
}

const TACOS: Taco[] = [
  {
    id: '1',
    name: 'Classic Carnitas',
    description: 'Slow-braised pork with cilantro, onions, and lime',
    spiceLevel: 'mild',
    price: 4.50,
  },
  {
    id: '2',
    name: 'Chicken Tinga',
    description: 'Shredded chicken in chipotle tomato sauce',
    spiceLevel: 'medium',
    price: 4.00,
  },
  {
    id: '3',
    name: 'Al Pastor',
    description: 'Marinated pork with pineapple and achiote',
    spiceLevel: 'medium',
    price: 5.00,
  },
  {
    id: '4',
    name: 'Barbacoa',
    description: 'Slow-cooked beef cheek with consommé',
    spiceLevel: 'mild',
    price: 5.50,
  },
  {
    id: '5',
    name: 'Diablo Shrimp',
    description: 'Spicy garlic shrimp with habanero salsa',
    spiceLevel: 'hot',
    price: 6.00,
  },
  {
    id: '6',
    name: 'Ghost Pepper Special',
    description: 'For the brave only. Signed waiver required.',
    spiceLevel: 'extreme',
    price: 7.00,
  },
];

const spiceColors: Record<Taco['spiceLevel'], 'success' | 'warning' | 'error' | 'secondary'> = {
  mild: 'success',
  medium: 'warning',
  hot: 'error',
  extreme: 'secondary',
};

const spiceEmoji: Record<Taco['spiceLevel'], string> = {
  mild: '🌶️',
  medium: '🌶️🌶️',
  hot: '🌶️🌶️🌶️',
  extreme: '🔥💀🔥',
};

export default function TacoPage(): React.ReactElement {
  const [cart, setCart] = useState<string[]>([]);
  const [ordered, setOrdered] = useState(false);

  const addToCart = (tacoId: string) => {
    setCart((prev) => [...prev, tacoId]);
  };

  const handleOrder = () => {
    setOrdered(true);
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, id) => {
    const taco = TACOS.find((t) => t.id === id);
    return sum + (taco?.price || 0);
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box textAlign="center">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 1,
            }}
          >
            🌮 Taco Truck
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The finest tacos this side of the application. A fun demo page!
          </Typography>
        </Box>

        {ordered && (
          <Alert severity="success" onClose={() => setOrdered(false)}>
            Your order has been placed! Tacos are on the way. 🚚
          </Alert>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                🛒 Cart: {cart.length} taco{cart.length !== 1 ? 's' : ''} — ${cartTotal.toFixed(2)}
              </Typography>
              <Button variant="contained" color="inherit" onClick={handleOrder}>
                Place Order
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Taco Grid */}
        <Grid container spacing={3}>
          {TACOS.map((taco) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={taco.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {taco.name}
                      </Typography>
                      <Chip
                        label={spiceEmoji[taco.spiceLevel]}
                        color={spiceColors[taco.spiceLevel]}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {taco.description}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ${taco.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => addToCart(taco.id)}
                      >
                        Add to Cart
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer Note */}
        <Paper sx={{ p: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This is a demo page showcasing interactive components and state management.
            No actual tacos will be delivered (sorry! 😅)
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
