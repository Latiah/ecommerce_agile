#  Agile & DevOps practices Lab

## 1. Product Vision
**"An ecommerce project that allows users to check products and buy or order what they want."**

---

## Getting Started

First, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 2. Tech Stack
- **Framework:** Next.js 
- **Database:** Supabase
- **API:** FakeStoreAPI
- **Testing:** Vitest
- **CI/CD:** GitHub Actions

---


##  DevOps Practice 

### CI/CD Pipeline
The project uses **GitHub Actions** (`.github/workflows/ci.yml`) to ensure code quality. The pipeline triggers on every **push** to the main branch and performs:
1. Dependency Installation
2. Automated Testing (Vitest)
3. Production Build (`next build`)

### Testing
We utilize **Vitest** for three types of validation:
- **API Mocks:** Testing handling of external product data.
- **Database Mocks:** Testing Supabase insertion logic without polluting real data.
- **Logic Tests:** Verifying the mathematical accuracy of the shopping cart total.


### Installation Commands
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run automated tests
npm test
```
---
