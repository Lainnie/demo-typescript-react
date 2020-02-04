import * as React from "react";
import { render } from "athena-testing-library";

import EmailCheck from "../EmailCheck";

test("renders message asking to check email", () => {
  const { getByText } = render(<EmailCheck />);

  getByText(/please check your email inbox/i);
});
