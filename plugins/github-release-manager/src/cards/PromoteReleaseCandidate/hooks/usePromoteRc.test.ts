/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import {
  mockApiClient,
  mockReleaseCandidateCalver,
  mockSemverProject,
} from '../../../test-helpers/test-helpers';
import { usePromoteRc } from './usePromoteRc';

describe('usePromoteRc', () => {
  beforeEach(jest.clearAllMocks);

  it('should return the expected responseSteps and progress', async () => {
    const { result } = renderHook(() =>
      usePromoteRc({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
        rcRelease: mockReleaseCandidateCalver,
        releaseVersion: 'version-1.2.3',
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.run());
    });

    expect(result.error).toEqual(undefined);
    expect(result.current.responseSteps).toHaveLength(1);
  });

  it('should return the expected responseSteps and progress (with successCb)', async () => {
    const { result } = renderHook(() =>
      usePromoteRc({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
        rcRelease: mockReleaseCandidateCalver,
        releaseVersion: 'version-1.2.3',
        successCb: jest.fn(),
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.run());
    });

    expect(result.current.responseSteps).toHaveLength(2);
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "progress": 100,
        "responseSteps": Array [
          Object {
            "link": "mock_release_html_url",
            "message": "Promoted \\"mock_release_name\\"",
            "secondaryMessage": "from \\"rc-2020.01.01_1\\" to \\"mock_release_tag_name\\"",
          },
          Object {
            "icon": "success",
            "message": "Success callback successfully called 🚀",
          },
        ],
        "run": [Function],
        "runInvoked": true,
      }
    `);
  });
});
