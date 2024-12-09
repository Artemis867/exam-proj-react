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

interface UserData {
  username: string,
  email: string,
}

export default function ProfileForm({onShowProfileForm, userData, onUpdateUserData} : {
  onShowProfileForm: (toggle) => void,
  userData: UserData | {},
  onUpdateUserData: (userData) => void,
}) {

  const [showError, setShowError] = useState('');

  const navigate = useNavigate();
  
  const profileFormSchema = z.object({
    username: z.string().min(8, {
      message: "Username must be at least 8 characters.",
    }).max(20, {
      message: "Username should not exceed to 20 characters"
    }),
    email: z.string().email({ message : 'Invalid email address'})
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userData.username,
      email: userData.email,
    },
  });

  async function onSubmitUpdateProfile(values: z.infer<typeof profileFormSchema>) {

    console.log('access onSubmitUpdateProfile');

    try {
      const result = await axios.post("http://localhost:4000/user/update", values);
      console.log('RES: ');
      console.log(result);

      if(result.data.success == true) {
        onUpdateUserData(values);
        onShowProfileForm(false);
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

  const alertErrorMarkup = (
    <Alert variant="destructive" className="w-[340px] m-1">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {showError}
      </AlertDescription>
    </Alert>
  );

  const onShowProfilePage = (toggle) => {
    onShowProfileForm(toggle);
  }

  return (
    <Card className="w-[580px]">
      <CardHeader>
        <CardTitle>Update your Profile</CardTitle>
        <CardDescription>Update your latest information.</CardDescription>
      </CardHeader>
      {showError !== '' ? alertErrorMarkup : null}
      <Form {...profileForm}>
      <form onSubmit={profileForm.handleSubmit(onSubmitUpdateProfile)} className="">
        <CardContent>
              <FormField
                control={profileForm.control}
                name="username"
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
                control={profileForm.control}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="w-[100%]">Update Profile</Button>
          <Button type="button" variant="outline" onClick={(e) => onShowProfilePage(false)} className="w-[100%] ml-1">Back to Profile</Button>
        </CardFooter>
      </form>
      </Form>
    </Card>
  )
}