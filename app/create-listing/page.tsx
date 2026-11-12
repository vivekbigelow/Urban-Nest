"use client";

import { useRef, useState } from "react";
import FormSection from "../components/FormSection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuthProvider from "../providers/useAuthProvider";
import React from "react";
import { FieldErrors, IQueryResponse } from "../types/globalTypes";
import { ListingFormData } from "../types/listing";

const initialFormData: ListingFormData = {
  leaseTitle: "",
  leaseDescription: "",
  unitType: "",
  livingSpaceType: "PrivateSpace",
  subleaseDurationMonths: "",
  isIndefinite: false,
  monthlyRentPrice: "",
  subleaseRoomCount: "1",
  additionalRoomCount: "0",
  tenantCount: "0",
  bathRoomCount: "1",
  address: { street: "", city: "", state: "", zipCode: "" },
  amenities: {
    freeWifi: false,
    freeParking: false,
    petFriendly: false,
    washerDryer: false,
    cookingSpace: false,
  },
};

type KeysMatching<T, Value> = {
  [K in keyof T]-?: T[K] extends Value ? K : never;
}[keyof T];

type SpaceField = {
  name: KeysMatching<ListingFormData, string>;
  label: string;
  description: string;
  min: number;
};

const spaceDetails: SpaceField[] = [
  {
    name: "subleaseRoomCount",
    label: "Rooms being subleased",
    description: "Rooms you're offering in this listing. Minimum 1.",
    min: 1,
  },
  {
    name: "additionalRoomCount",
    label: "Additional Rooms",
    description: "Other rooms in the unit beyond the rooms you're offering.",
    min: 0,
  },
  {
    name: "tenantCount",
    label: "Current Other Tenants",
    description: "Other people currently living in the entire unit.",
    min: 0,
  },
  {
    name: "bathRoomCount",
    label: "Bathrooms",
    description: "Number of bathrooms in the unit.",
    min: 1,
  },
];

type AmenityKey = keyof ListingFormData["amenities"];

const availableAmenities: { key: AmenityKey; label: string }[] = [
  { key: "freeWifi", label: "Free Wi-Fi" },
  { key: "freeParking", label: "Free Parking" },
  { key: "petFriendly", label: "Pet Friendly" },
  { key: "washerDryer", label: "Washer and Dryer" },
  { key: "cookingSpace", label: "Cooking Space" },
];

const stateData = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" },
];

type Photo = {
  file: File;
  previewUrl: string;
};

export default function CreateListingPage() {
  // Check if user is logged in.
  const router = useRouter();

  const {
    state: { user, isAuthenticated },
  } = useAuthProvider();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Create state variables and functions to collect input from form.
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = event.target;

    const nextValue =
      type === "checkbox" && event.target instanceof HTMLInputElement
        ? event.target.checked
        : value;

    if (name.startsWith("address.")) {
      const addressField = name.slice("address.".length) as
        | "street"
        | "city"
        | "state"
        | "zipCode";

      setFormData((previous) => ({
        ...previous,
        address: {
          ...previous.address,
          [addressField]: String(nextValue),
        },
      }));
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: nextValue,
    }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 10 - photos.length);

    const addedPhotos = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotos((previous) => [...previous, ...addedPhotos]);

    // Allow the same file to be selected again later.
    event.target.value = "";
  }

  function removePhoto(indexToRemove: number) {
    setPhotos((previous) => {
      const photoToRemove = previous[indexToRemove];
      if (photoToRemove) URL.revokeObjectURL(photoToRemove.previewUrl);

      return previous.filter((_, index) => index !== indexToRemove);
    });
  }

  function addFieldError(field: string, message: string) {
    setFieldErrors((previous) => ({
      ...previous,
      [field]: [...(previous[field] ?? []), message],
    }));
  }

  function formatInput() {
    try {
      if (photos.length < 2 || photos.length > 10) {
        addFieldError("photos", "Choose between 2 and 10 photos.");
        throw new Error("Could not create the listing");
      }

      const rent = Number(formData.monthlyRentPrice);
      const duration = Number(formData.subleaseDurationMonths);

      if (!Number.isFinite(rent) || rent < 0) {
        addFieldError("rent", "Enter a valid monthly rent.");
        throw new Error("Could not create the listing");
      }

      if (
        !formData.isIndefinite &&
        (!Number.isInteger(duration) || duration < 1)
      ) {
        addFieldError("duration", "Enter a valid sublease duration.");
        throw new Error("Could not create the listing");
      }

      // Format Input
      const listing = {
        ...formData,
        monthlyRentPrice: rent,
        subleaseDurationMonths: formData.isIndefinite ? null : duration,
        subleaseRoomCount: Number(formData.subleaseRoomCount),
        additionalRoomCount: Number(formData.additionalRoomCount),
        bathRoomCount: Number(formData.bathRoomCount),
        tenantCount: Number(formData.tenantCount),
        userId: user?.id,
      };

      // create FormData object to send to api
      // use FormData instead of JSON in order to send photos
      const body = new FormData();
      body.append("listing", JSON.stringify(listing));

      photos.forEach(({ file }) => {
        body.append("photos", file);
      });

      return body;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Invalid input, could not create listing.",
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // reset error messages
    setSubmitError("");
    setFieldErrors({});

    // Validation
    if (!event.currentTarget.reportValidity()) return;

    if (!user?.id) {
      setSubmitError("Please log in before creating a listing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const body = formatInput();
      if (body) {
        const response = await fetch("api/listings", {
          method: "POST",
          body,
        });

        const result: IQueryResponse = await response.json();

        if (!response.ok || result.error) {
          throw new Error("Could not create listing.");
        }

        setFieldErrors({});
        setSubmitError("");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-5xl tracking-tight">Create your listing</h1>
        <p className="text-[var(--muted-text)]">
          Create your listing and help someone find their next nest.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-[24px] text-[var(--primary)]"
      >
        <FormSection
          title="Listing Details"
          description="Start with the essentials about your sublease."
        >
          {/* Lease Title */}
          <div className="form-item">
            <label htmlFor="leaseTitle">Lease Title *</label>
            <input
              id="leaseTitle"
              name="leaseTitle"
              value={formData.leaseTitle}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Private Room Near Campus"
              required
              className="input-field"
            />
            {fieldErrors.leaseTitle?.map((error, index) => (
              <p
                key={`${error}-${index}`}
                className="mt-2 text-sm text-red-600"
              >
                {error}
              </p>
            ))}
          </div>

          {/* Lease Description */}
          <div className="form-item">
            <label htmlFor="leaseDescription">Lease Description *</label>
            <textarea
              id="leaseDescription"
              name="leaseDescription"
              onChange={handleChange}
              value={formData.leaseDescription}
              required
              rows={3}
              placeholder="Describe the unit, the room you're offering, and when it’s available…"
              className="input-field"
            />
            {fieldErrors.leaseDescription?.map((error, index) => (
              <p
                key={`${error}-${index}`}
                className="mt-2 text-sm text-red-600"
              >
                {error}
              </p>
            ))}
          </div>

          {/* Monthly Rent and Sublease Duration */}
          <div className="flex flex-row justify-between w-full gap-[24px]">
            <div className="form-item w-full">
              <label htmlFor="monthlyRentPrice">Monthly Rent *</label>
              <div className="flex items-center overflow-hidden input-field">
                <span>$</span>
                <input
                  id="monthlyRentPrice"
                  name="monthlyRentPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.monthlyRentPrice}
                  onChange={handleChange}
                  required
                  className="min-w-0 flex-1 bg-transparent border-none"
                />
                <span className="whitespace-nowrap">USD / Month</span>
              </div>

              <p className="mt-1 text-[11px] text-[var(--muted-text)]">
                Rent for the space you&apos;re subleasing, per month.
              </p>
              {fieldErrors.monthlyRentPrice?.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>
            <div className="form-item w-full">
              <label htmlFor="subleaseDurationMonths">
                Sublease Duration *
              </label>
              <div className="flex items-center overflow-hidden input-field">
                <input
                  id="subleaseDurationMonths"
                  name="subleaseDurationMonths"
                  type="number"
                  placeholder="e.g. 6"
                  min="1"
                  step="1"
                  value={formData.subleaseDurationMonths}
                  onChange={handleChange}
                  disabled={formData.isIndefinite}
                  required={!formData.isIndefinite}
                  className="w-full"
                />
                <span>months</span>
              </div>
              {/* Indefinite duration checkbox */}
              <label
                htmlFor="isIndefinite"
                className="mt-2 flex w-fit cursor-pointer items-center gap-2 text-[11px] text-[var(--muted-text)]"
              >
                <input
                  id="isIndefinite"
                  type="checkbox"
                  name="isIndefinite"
                  checked={formData.isIndefinite}
                  onChange={handleChange}
                  className="checkbox-field"
                />

                <span>
                  Indefinite
                  <span className="mx-1">-</span>
                  No set duration
                </span>
              </label>
              {fieldErrors.subleaseDurationMonths?.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>
          </div>
        </FormSection>
        <FormSection
          title="Space Details"
          description="Help others understand the space and who they'll share it
              with."
        >
          {/* Unit type */}
          <div className="form-item">
            <label htmlFor="unitType">Unit Type *</label>
            <select
              className={`select-field ${
                formData.unitType === ""
                  ? "text-[var(--muted-text)]"
                  : "text-[var(--input-text)]"
              }`}
              id="unitType"
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a unit type
              </option>
              <option className="option-item" value="Apartment">
                Apartment
              </option>
              <option className="option-item" value="House">
                House
              </option>
              <option className="option-item" value="Condo">
                Condo
              </option>
              <option className="option-item" value="Townhouse">
                Townhouse
              </option>
              <option className="option-item" value="Duplex">
                Duplex
              </option>
              <option className="option-item" value="Triplex">
                Triplex
              </option>
              <option className="option-item" value="Other">
                Other
              </option>
            </select>
            {fieldErrors.unitType?.map((error, index) => (
              <p
                key={`${error}-${index}`}
                className="mt-2 text-sm text-red-600"
              >
                {error}
              </p>
            ))}
          </div>
          {/* Private or shared */}

          <fieldset className="form-item">
            <legend>Living space type *</legend>

            <div className="flex flex-row gap-[8px] ">
              <label
                htmlFor="livingSpaceType"
                className={`flex flex-row gap-[8px] input-field ${formData.livingSpaceType === "PrivateSpace" ? "selected-checkbox-label" : ""}`}
              >
                <input
                  id="livingSpaceType"
                  type="radio"
                  name="livingSpaceType"
                  value="PrivateSpace"
                  checked={formData.livingSpaceType === "PrivateSpace"}
                  onChange={handleChange}
                  className="checkbox-field"
                />
                <span className="flex flex-col ">
                  <span className="block font-medium">Private Space</span>
                  <span className="mt-1 block text-[var(--muted-text)]">
                    The offered space or room is yours.
                  </span>
                </span>
              </label>
              <label
                htmlFor="livingSpaceType"
                className={`flex flex-row gap-[8px] input-field ${formData.livingSpaceType === "SharedSpace" ? "selected-checkbox-label" : ""}`}
              >
                <input
                  type="radio"
                  name="livingSpaceType"
                  value="SharedSpace"
                  checked={formData.livingSpaceType === "SharedSpace"}
                  onChange={handleChange}
                  className="checkbox-field"
                />
                <span className="flex flex-col ">
                  <span className="block font-medium">Shared Space</span>
                  <span className="mt-1 block text-[var(--muted-text)]">
                    The offered is shared with others.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
          {fieldErrors.livingSpaceType?.map((error, index) => (
            <p key={`${error}-${index}`} className="mt-2 text-sm text-red-600">
              {error}
            </p>
          ))}

          <div className="flex flex-col gap-4">
            {spaceDetails.map(({ name, label, description, min }) => (
              <div
                className="flex justify-between border-b border-b-[color:var(--card-border)] pb-3"
                key={name}
              >
                <div className="flex flex-col gap-2">
                  <label className="flex gap-2 text-sm" htmlFor={name}>
                    {label} *
                    {fieldErrors[name]?.map((error, index) => (
                      <p
                        key={`${error}-${index}`}
                        className="text-sm text-red-600"
                      >
                        {error}
                      </p>
                    ))}
                  </label>
                  <span className="text-xs text-[var(--muted-text)]">
                    {description}
                  </span>
                </div>

                <div className="flex h-10 items-center gap-2 rounded-full border border-[color:var(--card-border)] p-1">
                  <button
                    type="button"
                    aria-label={`Decrease ${label}`}
                    onClick={() => {
                      const current = Number(formData[name]) || min;
                      handleChange({
                        target: {
                          name,
                          value: String(Math.max(min, current - 1)),
                        },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="grid size-8 place-items-center rounded-full cursor-pointer bg-[var(--card-border)]/30"
                  >
                    −
                  </button>

                  <input
                    id={name}
                    name={name}
                    type="number"
                    min={min}
                    step={1}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-10 border-0 bg-transparent p-0 text-center outline-none space-detail-input"
                    required
                  />

                  <button
                    type="button"
                    aria-label={`Increase ${label}`}
                    onClick={() => {
                      const current = Number(formData[name]) || min;
                      handleChange({
                        target: { name, value: String(current + 1) },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="grid size-8 place-items-center rounded-full cursor-pointer bg-[var(--card-border)]/30"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FormSection>
        <FormSection
          title="Property Address"
          description="Where is the space located?"
        >
          <div className="form-item">
            <label htmlFor="street">Street Address *</label>
            <input
              id="street"
              name="address.street"
              type="text"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="123 College Ave"
              className="input-field"
            />
            {fieldErrors.street?.map((error, index) => (
              <p
                key={`${error}-${index}`}
                className="mt-2 text-sm text-red-600"
              >
                {error}
              </p>
            ))}
          </div>
          <div className="flex flex-row gap-[8px]">
            <div className="form-item">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                name="address.city"
                type="text"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="input-field"
                required
              />
              {fieldErrors.city?.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>

            <div className="form-item w-full">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className={`select-field ${
                  formData.address.state === ""
                    ? "text-[var(--muted-text)]"
                    : "text-[var(--input-text)]"
                }`}
                required
              >
                <option className="option-item-placeholder" value="" disabled>
                  Select state
                </option>
                {stateData.map((state) => (
                  <option
                    key={state.code}
                    value={state.code}
                    className="option-item"
                  >
                    {state.name}
                  </option>
                ))}
              </select>
              {fieldErrors.state?.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>
            <div className="form-item">
              <label htmlFor="zipCode">ZIP Code *</label>
              <input
                id="zipCode"
                name="address.zipCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5}(-[0-9]{4})?"
                maxLength={10}
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="5-Digit ZIP"
                className="input-field"
                required
              />
              {fieldErrors.zipCode?.map((error, index) => (
                <p
                  key={`${error}-${index}`}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>
          </div>
        </FormSection>
        <FormSection
          title="Amenities"
          description="Select what's included. You can leave all amenities unselected."
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {availableAmenities.map(({ key, label }) => (
              <label
                key={key}
                htmlFor={key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--card-border)] p-3 text-xs text-[var(--primary)] transition hover:bg-[var(--background)] "
              >
                <input
                  type="checkbox"
                  id={key}
                  value={key}
                  checked={formData.amenities[key]}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      amenities: {
                        ...previous.amenities,
                        [key]: event.target.checked,
                      },
                    }))
                  }
                  className="checkbox-field"
                />
                {label}
              </label>
            ))}
          </div>
        </FormSection>
        <FormSection
          title="Photos *"
          description="Add at least 2 photos &#x28;maximum 10&#x29;."
        >
          {fieldErrors.photos?.map((error, index) => (
            <p key={`${error}-${index}`} className="mt-2 text-sm text-red-600">
              {error}
            </p>
          ))}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="photo-upload w-full"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-2 text-[#527b64]"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-xs font-medium text-[var(--primary)]">
              Choose photos from your device
            </span>
            <span className="secondary-button mt-3">Choose Photos</span>
          </button>
          <div className="mt-3 flex justify-between text-[11px] text-[var(--muted-text)]">
            <span className="input-description">
              Choose multiple photos of the room and shared spaces.
            </span>
            <span className="text-[var(--primary)]">
              {photos.length}/10 photos
            </span>
          </div>

          {photos.length > 0 && (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map(({ file, previewUrl }, index) => (
                <li
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="relative overflow-hidden"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 33vw"
                      src={previewUrl}
                      alt={file.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="block truncate py-1 text-xs">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="shrink-0 underline cursor-pointer text-[red]"
                      aria-label={`Remove ${file.name}`}
                    >
                      X Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </FormSection>
        <FormSection
          title="Ready to share your space?"
          description="Check your details, then create your listing."
        >
          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating listing..." : "Create your listing"}
          </button>
        </FormSection>
      </form>
    </div>
  );
}
