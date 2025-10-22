# Globetrotter: Flight Booking Flow

Globetrotter is a modern, modular flight reservation system built with **Next.js** and **TypeScript**. It guides the user through a four-step purchasing process, emphasizing clear structure, strict validation logic, and real-time cost calculation.

## Key Features

* **4-Step Flow:** A clear path from destination selection to final summary.
* **Passenger Management:** Support for adding and managing multiple travelers with required data forms.
* **Additional Services:** Options for travel insurance, seat selection, extra baggage, and special assistance.
* **Step-by-Step Validation:** Strict validation logic (`utils/validation.ts`) ensures data integrity before the user can proceed.
* **Real-Time Cost Calculation:** An updated cost summary that includes base flight price, pet fees, and extra luggage fees (`utils/calculateTotalCost.ts`).
* **Modern UI:** Built with **Tailwind CSS** for a responsive and clean design.

***

## Technologies Used

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management (Local):** Centralized React hooks (`useState`, `useCallback`, `useMemo`) within `useBookingFlow.ts`.
* **Data Simulation:** External flight options fetched from a mock API (`services/flightService.ts`).

***

## Project Structure

The project follows a clear convention separating components, logic, and utilities.

## 🛠️ Installation and Setup

To run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/eleazarmgil/globetrotter.git
    cd globetrotter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application will be accessible at `http://localhost:3000`.

***