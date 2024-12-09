import React, {useState, useCallback, useEffect} from "react";
import { AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

export default function SignupForm({handleShowSignUp}) {

  const [showError, setShowError] = useState('');

  const navigate = useNavigate();
  
  const signupFormSchema = z.object({
    signupUsername: z.string().min(8, {
      message: "Username must be at least 8 characters.",
    }).max(20, {
      message: "Username should not exceed to 20 characters"
    }),
    email: z.string().email({ message : 'Invalid email address'}),
    signupPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(20, {
      message: "Password should not exceed to 20 characters"
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters.",
    })
    .max(20, {
      message: "Confirm Password should not exceed to 20 characters"
    })
  });

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      signupUsername: "",
      email: "",
      signupPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmitSignup(values: z.infer<typeof signupFormSchema>) {

    try {

      const result = await axios.post("http://localhost:4000/user/register", values);

      console.log('API RESULT: ');
      console.log(result);

      if(result.data.success == true) {
        localStorage.setItem("username", values.signupUsername);
        navigate('/profile');
      } else {
        console.log(result.data.message);
      }
    } catch(err) {
      console.log('ERROR: ');
      console.log(err);
      setShowError(err.response.data.message);
    }


  }

  const onShowSignup = (toggle) => {
    handleShowSignUp(toggle);
  }

  const alertErrorMarkup = (
    <Alert variant="destructive" className="w-[340px] m-1">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {showError}
      </AlertDescription>
    </Alert>
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Signup to ExamApp</CardTitle>
        <CardDescription>Create account to access amazing features.</CardDescription>
      </CardHeader>
      {showError !== '' ? alertErrorMarkup : null}
      <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="">
        <CardContent>
              <FormField
                control={signupForm.control}
                name="signupUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Add post here
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="signupPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Add post here
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm password" type="password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Add post here
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="w-[100%]">Create Account</Button>
          <Button variant="outline" onClick={(e) => onShowSignup(false)}>Back to Login</Button>
        </CardFooter>
      </form>
      </Form>
    </Card>
  )
}