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
import FileBase64 from '@/components/FileBase64';

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
  interface Files {
    base64: any;
    // Add any other properties as needed
  }
  const [formError, setFormError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [files, setFiles] = useState<Files>();
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
    data.image = files?.base64;

    if (data.image === undefined) {
      data.image =
        'data:image/png;base64,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';
    }
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
        if (checkBox) {
          const repEmailList = await fetch('/api/emailList', {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            },
          });
          let fireEmailUser = await repEmailList.json();
          try {
            const insertEmail = fireEmailUser.data;
            for (let i = 0; i < insertEmail.length; i++) {
              const value = insertEmail[i];

              await fetch('/api/fireEmail', {
                method: 'Post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
              });
            }
          } catch (error) {
            console.log(error);
          }
        }

        localStorage.setItem('apiKey', data.apiKey);
        router.push('/map');
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

  const getFiles = (files: any) => {
    setFiles({ ...files });
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
        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              onClick={() => setCheckBox(!checkBox)}
              type="checkbox"
              className="bg-slate-600 checkbox checkbox-success"
            />
            <span className="mr-3 label-text">
              Check This Box If There Is A Fire 🔥
            </span>
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text capitalize">Add Image</span>
          </label>
          <FileBase64 onDone={(files) => getFiles(files)} />
        </div>
        <div>
          <label className="cursor-pointer label"></label>
        </div>
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
                      fillRule="evenodd"
                      clipRule="evenodd"
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
