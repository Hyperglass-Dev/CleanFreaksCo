# CleanFreaksCo (CleanSweepHQ) Agent Guidelines

## Build/Test Commands
- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking (no emit)
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with file watching

## Architecture
- **Framework**: Next.js 15.3.3 with TypeScript
- **Firebase Project**: cleansweephq-dmwr4 
- **AI Integration**: Google Genkit for smart job allocation
- **UI**: Radix UI + Tailwind CSS + Shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

## Key Directories
- `src/app/` - Next.js app router pages
- `src/components/` - React components (ui/ for shared, business components at root)
- `src/lib/` - Utilities, types, Firebase config, data layer
- `src/ai/` - Genkit AI flows and configuration

## Style Guidelines
- **Colors**: Soft lavender (#E6E6FA), Light rose (#F8BBD0), Muted gold (#FFD700), Maroon (#800000)
- **Font**: Lato sans-serif throughout
- **Design**: Minimalist with rounded corners, gentle animations
- Use className with Tailwind, follow existing component patterns
- Consistent spacing and clean hierarchy
