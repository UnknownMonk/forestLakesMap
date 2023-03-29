'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import formatDate from 'date-fns/format';
import {
  TravelLogRequest,
  TravelLogProperty,
  TravelLogPropertyWithoutLocation,
} from '@/models/TravelLog/TravelLog';
import { useContext, useEffect, useState } from 'react';
import TravelLogContext from '@/TravelLogContext';
import { TravelLogActionType } from '@/types/TravelLogProviderTypes';

const travelLogInputs: Record<
  TravelLogPropertyWithoutLocation,
  {
    label?: string;
    style?: any;
    title?: string;
    type: 'text' | 'url' | 'textarea' | 'number' | 'date' | 'password';
  }
> = {
  apiKey: {
    label: 'API Key',
    type: 'password',
    title: 'Get API key from the Forest Lakes Park Road Dues Monthly Email',
    style: { cursor: 'help' },
  },
  title: {
    type: 'text',
    title:
      'Add a title to your post giving general info on what your sighting is about',
    style: { cursor: 'help' },
  },
  description: {
    type: 'textarea',
    title:
      'Add a description about what you saw and information about your sighting',
    style: { cursor: 'help' },
  },
  image: {
    type: 'url',
    title: 'Add image URL from a hosted platform like photo bucket or Google ',
    style: { cursor: 'help' },
  },
  danger: {
    type: 'number',
    title: 'Give a danger level of your sighting',
    style: { cursor: 'help' },
  },
  visitDate: {
    label: 'Visit Date',
    type: 'date',
    title: 'Add the date of the sighting',
    style: { cursor: 'help' },
  },
};

const nowString = formatDate(new Date(), 'yyyy-MM-dd');

interface TravelLogFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TravelLogForm({
  onCancel,
  onComplete,
}: TravelLogFormProps) {
  const [formError, setFormError] = useState('');
  const { state, dispatch } = useContext(TravelLogContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TravelLogRequest>({
    resolver: zodResolver(TravelLogRequest),
    defaultValues: {
      title: '',
      description: '',
      danger: 5,
      latitude: state.currentMarkerLocation?.lat,
      longitude: state.currentMarkerLocation?.lng,
      visitDate: nowString,
      apiKey: localStorage.getItem('apiKey') ?? '',
    },
  });
  useEffect(() => {
    setValue('latitude', state.currentMarkerLocation?.lat ?? 90);
    setValue('longitude', state.currentMarkerLocation?.lng ?? 180);
  }, [state.currentMarkerLocation, setValue]);
  const onSubmit: SubmitHandler<TravelLogRequest> = async (data) => {
    try {
      setFormError('');
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        localStorage.setItem('apiKey', data.apiKey);
        router.push('/');
        dispatch({
          type: TravelLogActionType.SET_CURRENT_MARKER_LOCATION,
          data: null,
        });
        reset();
        onComplete();
      } else {
        const json = await response.json();
        throw new Error(json.message);
      }
    } catch (e) {
      const error = e as Error;
      // TODO: cleanup zod error message
      setFormError(error.message);
    }
  };
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => {
            dispatch({
              type: TravelLogActionType.SET_CURRENT_MARKER_LOCATION,
              data: null,
            });
            onCancel();
            reset();
          }}
          className="btn btn-secondary"
        >
          CANCEL
        </button>
      </div>
      <form
        className="mx-auto max-w-md flex gap-4 flex-col my-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {formError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formError}</span>
            </div>
          </div>
        )}
        {Object.entries(travelLogInputs).map(([name, value]) => {
          const property = name as TravelLogProperty;
          return (
            <div key={name} className="form-control w-full">
              <label className="label">
                <span className="label-text capitalize">
                  {value.label || name}
                </span>
                <span title={value.title} style={value.style}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {' '}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM10 7C9.63113 7 9.3076 7.19922 9.13318 7.50073C8.85664 7.97879 8.24491 8.14215 7.76685 7.86561C7.28879 7.58906 7.12543 6.97733 7.40197 6.49927C7.91918 5.60518 8.88833 5 10 5C11.6569 5 13 6.34315 13 8C13 9.30622 12.1652 10.4175 11 10.8293V11C11 11.5523 10.5523 12 10 12C9.44773 12 9.00001 11.5523 9.00001 11V10C9.00001 9.44772 9.44773 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z"
                      fill="#c7c7c7"
                    ></path>{' '}
                  </svg>
                </span>
              </label>
              {value.type === 'textarea' ? (
                <textarea
                  className={`textarea textarea-bordered w-full ${
                    errors.description ? 'textarea-error' : ''
                  }`}
                  {...register(property)}
                />
              ) : (
                <input
                  type={value.type}
                  step="any"
                  className={`input input-bordered w-full ${
                    errors[property] ? 'input-error' : ''
                  }`}
                  {...register(property)}
                />
              )}
              {errors[property] && <span>{errors[property]?.message}</span>}
            </div>
          );
        })}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text capitalize">Latitude, Longitude</span>
          </label>
          <input
            value={[
              state.currentMarkerLocation?.lat.toFixed(6),
              state.currentMarkerLocation?.lng.toFixed(6),
            ].join(', ')}
            className="input input-bordered w-full disabled"
            disabled
          />
        </div>
        <button className="btn btn-success">Create</button>
      </form>
    </>
  );
}
