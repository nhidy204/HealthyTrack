// import { render } from '@testing-library/react';
// import { screen } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
// import { vi } from 'vitest';
// import Button from './button';

// describe('Button', () => {

//   // test render, prop đơn giản
//   describe('Render', () => {

//     it('hiển thị đúng text được truyền vào', () => {
//       //render button với text "Click me"
//       render(<Button>Click me</Button>);
//       // tìm button theo role và kiểm tra có trong DOM không
//       expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
//     });

//     it('mặc định là variant primary', () => {
//       render(<Button>Primary</Button>);
//       // className phải chứa class 'primary' từ CSS module
//       expect(screen.getByRole('button').className).toContain('primary');
//     });

//     it('render đúng variant outline', () => {
//       render(<Button variant="outline">Outline</Button>);
//       expect(screen.getByRole('button').className).toContain('outline');
//     });

//     it('render đúng variant ghost', () => {
//       render(<Button variant="ghost">Ghost</Button>);
//       expect(screen.getByRole('button').className).toContain('ghost');
//     });

//     it('render full width khi fullWidth=true', () => {
//       render(<Button fullWidth>Full</Button>);
//       expect(screen.getByRole('button').className).toContain('fullWidth');
//     });

//     it('nhận className tùy chỉnh từ bên ngoài', () => {
//       render(<Button className="my-custom-class">Custom</Button>);
//       expect(screen.getByRole('button').className).toContain('my-custom-class');
//     });

//   });

//   //kiểm tra trạng thái loading
//   describe('Loading state', () => {

//     it('hiển thị spinner khi loading=true', () => {
//       render(<Button loading>Save</Button>);
//       // aria-hidden="true" trên spinner --> dùng querySelector thay vì getByRole
//       const spinner = screen.getByRole('button').querySelector('[aria-hidden="true"]');
//       expect(spinner).toBeInTheDocument();
//     });

//     it('bị disabled khi loading=true', () => {
//       render(<Button loading>Save</Button>);
//       expect(screen.getByRole('button')).toBeDisabled();
//     });

//     it('text bị ẩn khi loading=true (có class hiddenText)', () => {
//       render(<Button loading>Save</Button>);
//       const textSpan = screen.getByText('Save');
//       expect(textSpan.className).toContain('hiddenText');
//     });

//     it('không hiển thị spinner khi loading=false', () => {
//       render(<Button>Save</Button>);
//       const spinner = screen.getByRole('button').querySelector('[aria-hidden="true"]');
//       expect(spinner).not.toBeInTheDocument();
//     });

//   });

//   //kiểm tra trạng thái disabled
//   describe('Disabled state', () => {

//     it('bị disabled khi disabled=true', () => {
//       render(<Button disabled>Disabled</Button>);
//       expect(screen.getByRole('button')).toBeDisabled();
//     });

//     it('không gọi onClick khi disabled', async () => {
//       const handleClick = vi.fn(); // tạo mock function để theo dõi có được gọi không
//       render(<Button disabled onClick={handleClick}>Click</Button>);
//       await userEvent.click(screen.getByRole('button'));
//       expect(handleClick).not.toHaveBeenCalled();
//     });

//   });

//   //kiểm tra tương tác click
//   describe('Click interaction', () => {

//     it('gọi onClick khi được click', async () => {
//       const handleClick = vi.fn();
//       render(<Button onClick={handleClick}>Click</Button>);
//       await userEvent.click(screen.getByRole('button'));
//       //kiểm tra hàm được gọi đúng 1 lần
//       expect(handleClick).toHaveBeenCalledTimes(1);
//     });

//     it('không gọi onClick khi đang loading', async () => {
//       const handleClick = vi.fn();
//       render(<Button loading onClick={handleClick}>Click</Button>);
//       await userEvent.click(screen.getByRole('button'));
//       expect(handleClick).not.toHaveBeenCalled();
//     });

//   });

//   //kiểm tra type của button
//   describe('Button type', () => {

//     it('mặc định không có type (dùng browser default)', () => {
//       render(<Button>Button</Button>);
//       // không truyền type --> attribute type không được set
//       expect(screen.getByRole('button')).not.toHaveAttribute('type', 'submit');
//     });

//     it('render type="submit" khi được truyền vào', () => {
//       render(<Button type="submit">Submit</Button>);
//       expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
//     });

//     it('render type="button" khi được truyền vào', () => {
//       render(<Button type="button">Button</Button>);
//       expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
//     });

//   });

// });