import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

interface UserFormData {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: UserFormData;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: user || { id: "", name: "", age: undefined, hobbies: [""] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const submitHandler: SubmitHandler<UserFormData> = async (data) => {
    //validation
    if (data.age <= 0 || !Number.isInteger(data.age)) {
      alert("Age must be a positive integer.");
      return;
    }
    if (data.hobbies.length === 0 || data.hobbies.some((hobby) => !hobby.trim())) {
      alert("Please enter at least one valid hobby.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save user");
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
      className="max-w-3xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">User Form</h2>
      <div>
        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
          ID
        </label>
        <input
          id="id"
          type="text"
          {...register("id", { required: true })}
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        {errors.id && (
          <p className="mt-1 text-sm text-red-600">ID is required.</p>
        )}
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: true })}
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">Name is required.</p>
        )}
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          type="number"
          {...register("age", { required: true, valueAsNumber: true })}
          className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          min="1"
          required
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">Age is required.</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hobbies</label>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4">
              <input
                type="text"
                {...register(`hobbies.${index}` as const)}
                placeholder={`Hobby ${index + 1}`}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="text-indigo-600 hover:text-indigo-800"
          >
            + Add Hobby
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );
};

export default UserForm;
