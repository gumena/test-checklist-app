import { supabase } from '@/lib/supabase';

const templates = [
  {
    name: 'Login & Authentication Flow',
    description: 'Complete test cases for user authentication including login, logout, password reset, and session management',
    category: 'Authentication',
    items: [
      {
        title: 'Verify login with valid credentials',
        description: 'Test that users can successfully log in with correct username and password',
        expected_result: 'User is redirected to dashboard and session is created',
        priority: 'critical',
        position: 0,
      },
      {
        title: 'Verify login with invalid credentials',
        description: 'Test that login fails with incorrect credentials',
        expected_result: 'Error message displayed, user remains on login page',
        priority: 'critical',
        position: 1,
      },
      {
        title: 'Verify password visibility toggle',
        description: 'Test show/hide password functionality',
        expected_result: 'Password characters toggle between visible and hidden',
        priority: 'medium',
        position: 2,
      },
      {
        title: 'Verify "Remember Me" functionality',
        description: 'Test that remember me checkbox persists session',
        expected_result: 'User session persists across browser restarts',
        priority: 'medium',
        position: 3,
      },
      {
        title: 'Verify logout functionality',
        description: 'Test that user can successfully log out',
        expected_result: 'Session is terminated and user is redirected to login',
        priority: 'critical',
        position: 4,
      },
      {
        title: 'Verify forgot password flow',
        description: 'Test password reset email is sent and link works',
        expected_result: 'Reset email received and password can be changed',
        priority: 'high',
        position: 5,
      },
    ],
  },
  {
    name: 'E-commerce Checkout Process',
    description: 'Comprehensive checkout flow testing including cart management, payment processing, and order confirmation',
    category: 'E-commerce',
    items: [
      {
        title: 'Add item to cart',
        description: 'Verify item can be added to shopping cart',
        expected_result: 'Item appears in cart with correct price and quantity',
        priority: 'critical',
        position: 0,
      },
      {
        title: 'Update cart quantity',
        description: 'Test that item quantities can be increased/decreased',
        expected_result: 'Cart totals update correctly when quantity changes',
        priority: 'high',
        position: 1,
      },
      {
        title: 'Remove item from cart',
        description: 'Verify items can be removed from cart',
        expected_result: 'Item is removed and totals recalculate',
        priority: 'high',
        position: 2,
      },
      {
        title: 'Apply discount code',
        description: 'Test that valid promo codes apply discounts',
        expected_result: 'Discount is applied and reflected in total',
        priority: 'medium',
        position: 3,
      },
      {
        title: 'Enter shipping information',
        description: 'Test shipping address form validation and submission',
        expected_result: 'Valid addresses accepted, invalid rejected with errors',
        priority: 'critical',
        position: 4,
      },
      {
        title: 'Select shipping method',
        description: 'Verify different shipping options can be selected',
        expected_result: 'Shipping cost updates based on selected method',
        priority: 'high',
        position: 5,
      },
      {
        title: 'Enter payment information',
        description: 'Test payment form with various card types',
        expected_result: 'Valid cards accepted, invalid rejected',
        priority: 'critical',
        position: 6,
      },
      {
        title: 'Complete purchase',
        description: 'Verify order is processed and confirmation displayed',
        expected_result: 'Order confirmation page shown with order number',
        priority: 'critical',
        position: 7,
      },
      {
        title: 'Receive confirmation email',
        description: 'Verify order confirmation email is sent',
        expected_result: 'Email received with correct order details',
        priority: 'high',
        position: 8,
      },
    ],
  },
  {
    name: 'API Testing Suite',
    description: 'REST API endpoint testing including CRUD operations, authentication, and error handling',
    category: 'API Testing',
    items: [
      {
        title: 'Test GET endpoint',
        description: 'Verify GET request returns correct data',
        expected_result: '200 status code with expected JSON response',
        priority: 'critical',
        position: 0,
      },
      {
        title: 'Test POST endpoint',
        description: 'Verify POST request creates new resource',
        expected_result: '201 status code with created resource in response',
        priority: 'critical',
        position: 1,
      },
      {
        title: 'Test PUT endpoint',
        description: 'Verify PUT request updates existing resource',
        expected_result: '200 status code with updated resource data',
        priority: 'critical',
        position: 2,
      },
      {
        title: 'Test DELETE endpoint',
        description: 'Verify DELETE request removes resource',
        expected_result: '204 status code and resource no longer exists',
        priority: 'critical',
        position: 3,
      },
      {
        title: 'Test authentication required',
        description: 'Verify endpoints reject unauthenticated requests',
        expected_result: '401 status code when auth token missing',
        priority: 'critical',
        position: 4,
      },
      {
        title: 'Test authorization levels',
        description: 'Verify role-based access control works',
        expected_result: '403 status code when user lacks permissions',
        priority: 'high',
        position: 5,
      },
      {
        title: 'Test input validation',
        description: 'Verify API validates request data',
        expected_result: '400 status code with validation errors',
        priority: 'high',
        position: 6,
      },
      {
        title: 'Test rate limiting',
        description: 'Verify API rate limits are enforced',
        expected_result: '429 status code when limit exceeded',
        priority: 'medium',
        position: 7,
      },
    ],
  },
  {
    name: 'Mobile App Testing Checklist',
    description: 'Essential mobile app testing covering functionality, performance, and user experience',
    category: 'Mobile',
    items: [
      {
        title: 'Test app installation',
        description: 'Verify app installs correctly from app store',
        expected_result: 'App installs without errors and icon appears',
        priority: 'critical',
        position: 0,
      },
      {
        title: 'Test first launch experience',
        description: 'Verify onboarding flow and initial setup',
        expected_result: 'Smooth onboarding with clear instructions',
        priority: 'high',
        position: 1,
      },
      {
        title: 'Test portrait/landscape orientation',
        description: 'Verify UI adapts to device orientation',
        expected_result: 'Layout adjusts properly in both orientations',
        priority: 'high',
        position: 2,
      },
      {
        title: 'Test on different screen sizes',
        description: 'Verify app works on various device sizes',
        expected_result: 'UI renders correctly on all tested devices',
        priority: 'high',
        position: 3,
      },
      {
        title: 'Test offline functionality',
        description: 'Verify app behavior without network connection',
        expected_result: 'Graceful degradation with offline message',
        priority: 'high',
        position: 4,
      },
      {
        title: 'Test push notifications',
        description: 'Verify push notifications are received and tappable',
        expected_result: 'Notifications arrive and open correct screen',
        priority: 'medium',
        position: 5,
      },
      {
        title: 'Test app permissions',
        description: 'Verify permission requests work correctly',
        expected_result: 'Permission dialogs appear and choices respected',
        priority: 'high',
        position: 6,
      },
      {
        title: 'Test app performance',
        description: 'Verify app runs smoothly without lag',
        expected_result: 'Smooth animations and responsive interactions',
        priority: 'high',
        position: 7,
      },
      {
        title: 'Test battery consumption',
        description: 'Verify app doesn\'t drain battery excessively',
        expected_result: 'Normal battery usage during extended use',
        priority: 'medium',
        position: 8,
      },
    ],
  },
  {
    name: 'Security Audit Checklist',
    description: 'Security testing checklist covering common vulnerabilities and best practices',
    category: 'Security',
    items: [
      {
        title: 'Test SQL injection prevention',
        description: 'Verify inputs are properly sanitized against SQL injection',
        expected_result: 'Malicious SQL queries are rejected or escaped',
        priority: 'critical',
        position: 0,
      },
      {
        title: 'Test XSS prevention',
        description: 'Verify protection against cross-site scripting attacks',
        expected_result: 'Script tags and malicious code are sanitized',
        priority: 'critical',
        position: 1,
      },
      {
        title: 'Test CSRF protection',
        description: 'Verify forms have CSRF token protection',
        expected_result: 'Requests without valid tokens are rejected',
        priority: 'critical',
        position: 2,
      },
      {
        title: 'Test password requirements',
        description: 'Verify password complexity requirements enforced',
        expected_result: 'Weak passwords are rejected with clear requirements',
        priority: 'high',
        position: 3,
      },
      {
        title: 'Test password storage',
        description: 'Verify passwords are hashed and salted',
        expected_result: 'Passwords not stored in plain text in database',
        priority: 'critical',
        position: 4,
      },
      {
        title: 'Test session timeout',
        description: 'Verify inactive sessions expire appropriately',
        expected_result: 'User logged out after timeout period',
        priority: 'high',
        position: 5,
      },
      {
        title: 'Test HTTPS enforcement',
        description: 'Verify all traffic uses HTTPS',
        expected_result: 'HTTP requests redirect to HTTPS',
        priority: 'critical',
        position: 6,
      },
      {
        title: 'Test file upload restrictions',
        description: 'Verify uploaded files are validated and restricted',
        expected_result: 'Malicious files rejected with appropriate error',
        priority: 'high',
        position: 7,
      },
    ],
  },
];

export async function seedTemplates() {
  console.log('Starting template seeding...');

  for (const templateData of templates) {
    try {
      // Create template
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
        })
        .select()
        .single();

      if (templateError) {
        console.error(`Error creating template ${templateData.name}:`, templateError);
        continue;
      }

      console.log(`Created template: ${template.name}`);

      // Create template items
      if (templateData.items && templateData.items.length > 0) {
        const items = templateData.items.map((item) => ({
          template_id: template.id,
          ...item,
        }));

        const { error: itemsError } = await supabase
          .from('template_items')
          .insert(items);

        if (itemsError) {
          console.error(`Error creating items for ${templateData.name}:`, itemsError);
        } else {
          console.log(`  Created ${items.length} items`);
        }
      }
    } catch (error) {
      console.error(`Unexpected error:`, error);
    }
  }

  console.log('Template seeding complete!');
}

// Run if executed directly
if (require.main === module) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
