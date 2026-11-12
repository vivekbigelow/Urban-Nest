import Footer from "../components/Footer";
import { render, screen } from "@testing-library/react";

test("renders © 2026 Urban Nest", () => {
  render(<Footer />);

  expect(screen.getByText("© 2026 Urban Nest")).toBeInTheDocument();
});
