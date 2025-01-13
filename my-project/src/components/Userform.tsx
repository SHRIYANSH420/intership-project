import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the form's data structure
interface UserFormData {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

// Validation Schema
const schema = yup.object().shape({
  id: yup.string().required("ID is required"),
  name: yup.string().required("Name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .required("Age is required"),
  hobbies: yup
    .array()
    .of(yup.string().required("Hobby cannot be empty"))
    .min(1, "At least one hobby is required"),
});

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: UserFormData;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, user }) => {
  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: user || { id: "", name: "", age: undefined, hobbies: [""] },
  });

  // Field Array for Hobbies
  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  // Handle Form Submit
  const submitHandler: SubmitHandler<UserFormData> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      alert("User saved successfully!");
      reset();
    } catch {
      alert("Failed to save user. Try again!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6"
    >
      <div className="mb-4">
        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
          ID
        </label>
        <input
          id="id"
          type="text"
          {...register("id")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.id && (
          <span className="text-sm text-red-500">{errors.id.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          type="number"
          {...register("age")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.age && (
          <span className="text-sm text-red-500">{errors.age.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Hobbies</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center mb-2">
            <input
              type="text"
              {...register(`hobbies.${index}` as const)}
              placeholder={`Hobby ${index + 1}`}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
            {errors.hobbies && errors.hobbies[index] && (
              <span className="text-sm text-red-500 ml-2">
                {errors.hobbies[index]?.message}
              </span>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append("")}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add Hobby
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save
      </button>
    </form>
  );
};

export default UserForm;
