import { render, screen } from "@tests/setup/test-utils";
import { ProgressRing } from "@opal/components";

function arc(container: HTMLElement): SVGCircleElement | null {
  return container.querySelector(".opal-progress-ring-arc");
}

it("covers value / max of the ring, clamped to the full ring", () => {
  const { container, rerender } = render(<ProgressRing value={25} max={50} />);
  const full = Number(arc(container)?.getAttribute("stroke-dasharray"));
  expect(Number(arc(container)?.getAttribute("stroke-dashoffset"))).toBeCloseTo(
    full * 0.5
  );
  expect(screen.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "50"
  );

  rerender(<ProgressRing value={250} />);
  expect(Number(arc(container)?.getAttribute("stroke-dashoffset"))).toBeCloseTo(
    0
  );
  expect(screen.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100"
  );
});

it("draws only the track at zero", () => {
  const { container } = render(<ProgressRing value={0} />);
  expect(arc(container)).toBeNull();
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
});
