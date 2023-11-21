import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '@/components/emailTemplate';
import { Resend } from 'resend';

const resend = new Resend('re_b8h4UHzQ_85hg4EUUyZjvnJrk7NjmLVCg');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['melanymendoza2001@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
      text:'',
    });

    res.status(200).json({ message: 'Email sent successfully' });
} catch (error) {
    res.status(400).json(error);
  }
};
